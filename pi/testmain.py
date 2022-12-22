import network
import socket
import time
import secrets
import urequests as requests
import utime
import micropython

from machine import Pin, I2C
import ssd1306

# using default address 0x3C
i2c = I2C(0,sda=Pin(0), scl=Pin(1))
display = ssd1306.SSD1306_I2C(128, 64, i2c)
button = Pin(13, Pin.IN, Pin.PULL_UP)

motor1a = Pin(14, Pin.OUT)
motor1b = Pin(15, Pin.OUT)

ssidPrimary = secrets.ssidPrimary
passwordPrimary = secrets.passwordPrimary
ssidSecondary = secrets.ssidSecondary
passwordSecondary = secrets.passwordSecondary
apiHost = secrets.apiHost
deviceId = secrets.deviceId
registrationResource = f'{secrets.apiHost}/registration'
messagesResource = f'{secrets.apiHost}/messages'

wlan = network.WLAN(network.STA_IF)

global lastTime, readingMessages, messages, inactivityCounter, newTime
inactivityCounter = 0
messages = []
lastTime = 0
newTime = 0
readingMessages = False
unreadMessages = False
inactivityTimeout = 5
motorInterval = 10
fetchInterval = 30
fetchTimer = 0


def printToScreenBreakLines(content, centered = False):
    display.fill(0)
    splitOnNewlines = content.split('\n')
    # print(splitOnNewlines)
    lineCounter = 0
    for line in splitOnNewlines:
        currentLine = ''
        lineLengthCounter = 0
        split = line.split()
        for word in split:
            wordSpace = f'{word} '
            lineLengthCounter += len(wordSpace)
            if (lineLengthCounter > 16):
                display.text(f'{currentLine : ^16}' if centered else currentLine, 0, lineCounter * 12, 1)
                lineCounter += 1
                currentLine = wordSpace
                lineLengthCounter = len(wordSpace)
            else:
                currentLine += wordSpace
        display.text(f'{currentLine : ^16}' if centered else currentLine, 0, lineCounter * 12, 1)
        lineCounter += 1
            
    display.show()

def printToScreenRaw(content, centered = False):
    display.fill(0)
    split = content.split('\n')
    lineCounter = 0
    for line in split:
        display.text(f'{line : ^16}' if centered else line, 0, lineCounter * 12, 1)
        lineCounter += 1
        
    display.show()

def overlayTextBottom(text):
    display.fill_rect(0, 4*12 - 1, 128, 12, 1)
    display.text(f'{text : ^16}', 0, 4 * 12, 0)
    display.show()

def connectToNetwork():
    wlan.active(True)
    wlan.config(pm = 0xa11140)  # Disable power-save mode
    wlan.connect(ssidPrimary, passwordPrimary)

    max_wait = 10
    while max_wait > 0:
        if wlan.status() < 0 or wlan.status() >= 3:
            break
        printToScreenBreakLines(f'Connecting to:\n{ssidPrimary}...')
        max_wait -= 1
        time.sleep(1)

    if wlan.status() < 0 or wlan.status() > 3:
        wlan.connect(ssidSecondary, passwordSecondary)
        max_wait = 10
        while max_wait > 0:
            if wlan.status() < 0 or wlan.status() >= 3:
                break
            printToScreenBreakLines(f'Connecting to: {ssidSecondary}...')
            max_wait -= 1
            time.sleep(1)

    if wlan.status() != 3:
        printToScreenBreakLines('Network connection failed, are you within range of wifi?')
        raise RuntimeError('network connection failed')
    else:
        printToScreenBreakLines('Connected!')
        status = wlan.ifconfig()
        print('ip = ' + status[0])

def button_pressed(event):
    global lastTime, readingMessages, messages, inactivityCounter, newTime, unreadMessages, fetchTimer
    newTime = utime.ticks_ms()
    if (newTime - lastTime) > 300 and button.value() is 0:
        lastTime = newTime
        inactivityCounter = 0
        # micropython.mem_info()
        if readingMessages:
            if len(messages) > 0:
                printToScreenBreakLines(f'Sending read receipt...\n{len(messages)-1}\nmessage(s) left', True)
                overlayTextBottom('Loading')
                res = requests.post(f'{messagesResource}/read?id={messages[0]["id"]}')
                # error handling
                res.close()
                if len(messages) > 1:
                    printToScreenRaw(f'{messages[1]["message"]}\nfrom: {messages[1]["from"]}')
                    messages.pop(0)
                else:
                    printToScreenBreakLines('No new m essages\n:(', True)
                    unreadMessages = False
                    messages.pop(0)
                    readingMessages = False
                    fetchTimer = fetchInterval + 1
        elif len(messages) > 0:
            printToScreenRaw(f'{messages[0]["message"]}\nfrom: {messages[0]["from"]}')
            readingMessages = True
        else:
            fetchTimer = fetchInterval



def main():
    global readingMessages, messages, inactivityCounter, unreadMessages, fetchTimer
    username = ''
    motorTimer = 0
    fetchTimer = fetchInterval + 1

    printToScreenBreakLines('Connecting to network...')
    connectToNetwork()

    while True:
        try:
            if readingMessages:
                inactivityCounter += 1
                if (inactivityCounter > inactivityTimeout):
                    readingMessages = False
                    inactivityCounter = 0
                    motorTimer = 0
                    fetchTimer = 0
            else:
                if username is not '':
                    if fetchTimer > fetchInterval:
                        fetchTimer = 0
                        overlayTextBottom('Loading')
                        newMessages = requests.get(f'{messagesResource}?to={username}')
                        # TODO error handling...
                        messages = newMessages.json()
                        newMessages.close()

                    if not readingMessages:
                        if len(messages) > 0:
                            printToScreenBreakLines(f'You have\n\n{len(messages)} \n\nnew message(s)!', True)
                            unreadMessages = True
                            motorTimer += 1
                        else:
                            printToScreenBreakLines('No new messages\n:(', True)
                            unreadMessages = False
                        fetchTimer += 1
                else:
                    printToScreenBreakLines(f'Registering device with secret:\n{deviceId}', True)
                    overlayTextBottom('Loading')
                    res = requests.post(registrationResource, headers = { 'deviceId': deviceId })
                    # TODO add cases for server not found, and nice error messages
                    if res.status_code is 403:
                        print(res.text)
                        printToScreenBreakLines('Device not registered, ask for help')
                    else:
                        username = res.text.replace('"', '')
                        printToScreenBreakLines(f'Successfully registered! \nUsername: \n{username}', True)
                        print(username)
                    res.close()
                    time.sleep(3)

            if (motorTimer > motorInterval):
                motor1a.high()
                motor1b.low()
                time.sleep_ms(20)
                motor1a.low()
                motor1b.low()
                motorTimer = 0
        except Exception as err:
            print(err)
            printToScreenBreakLines(f'Error: {err}')
        # TODO do something for the heartbeat, refresh a character on the screen?
        time.sleep(1)  

button.irq(handler=button_pressed, trigger=Pin.IRQ_FALLING)
main()

