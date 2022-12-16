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

# TODO add multiple networks to try to connect to
ssid = secrets.ssid
password = secrets.password
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
inactivityTimeout = 5
motorInterval = 5


def printToScreenBreakLines(content):
    display.fill(0)
    split = content.split()
    lineCounter = 0
    currentLine = ''
    lineLengthCounter = 0
    for word in split:
        wordSpace = f'{word} '
        lineLengthCounter += len(wordSpace)
        if (lineLengthCounter > 16):
            display.text(currentLine, 0, lineCounter * 12, 1)
            lineCounter += 1
            currentLine = wordSpace
            lineLengthCounter = len(wordSpace)
        else:
            currentLine += wordSpace
        
    display.text(currentLine, 0, lineCounter * 12, 1)
    display.show()

def printToScreenRaw(content):
    display.fill(1)
    split = content.split('\n')
    lineCounter = 0
    for line in split:
        display.text(line, 0, lineCounter * 12, 0)
        lineCounter += 1
        
    display.show()

def connectToNetwork():
    wlan.active(True)
    wlan.config(pm = 0xa11140)  # Disable power-save mode
    printToScreenBreakLines(f'Connecting to: \n{ssid}...')
    wlan.connect(ssid, password)

    max_wait = 10
    while max_wait > 0:
        if wlan.status() < 0 or wlan.status() >= 3:
            break
        max_wait -= 1
        time.sleep(1)

    if wlan.status() != 3:
        printToScreenBreakLines('Network connection failed, are you within range of wifi?')
        raise RuntimeError('network connection failed')
    else:
        printToScreenBreakLines('Connected!')
        status = wlan.ifconfig()
        print('ip = ' + status[0])


# async def buttonListener():
#     print('Listening for button presses')
#     currentValue = 0
#     pressedTimes = 0
#     while True:
        
#         if currentValue is 0 and button.value() is 1:
#             pressedTimes+=1
#             print(pressedTimes)
#             currentValue = 1
#         if currentValue is 1 and button.value() is 0:
#             currentValue = 0
#         time.sleep_ms(50)

def button_pressed(change):
    global lastTime, readingMessages, messages, inactivityCounter, newTime
    newTime = utime.ticks_ms()
    if (newTime - lastTime) > 300 and button.value() is 0:
        lastTime = newTime
        inactivityCounter = 0
        # micropython.mem_info()
        if readingMessages:
            if len(messages) > 0:
                res = requests.post(f'{messagesResource}/read?id={messages[0]["id"]}')
                # error handl33ing
                res.close()
                if len(messages) > 1:
                    printToScreenBreakLines(f'{messages[1]["message"]} from: {messages[1]["from"]}')
                    messages.pop(0)
                else:
                    printToScreenBreakLines('No new messages... \n:(')
                    messages.pop(0)
                    readingMessages = False
        elif len(messages) > 0:
            printToScreenBreakLines(f'{messages[0]["message"]} from: {messages[0]["from"]}')
        readingMessages = True



def main():
    global readingMessages, messages, inactivityCounter
    username = ''
    motorTimer = 0

    

    printToScreenBreakLines('Connecting to network...')
    connectToNetwork()

    while True:
        try:
            if readingMessages:
                inactivityCounter += 1
                if (inactivityCounter > inactivityTimeout):
                    readingMessages = False
                    inactivityCounter = 0
            else:
                if username is not '':
                    newMessages = requests.get(f'{messagesResource}?to={username}')
                    # TODO error handling...
                    messages = newMessages.json()
                    newMessages.close()
                    if not readingMessages:
                        if len(messages) > 0:
                            printToScreenBreakLines('You have new messages!')
                            motorTimer += 1
                        else:
                            printToScreenBreakLines('No new messages... \n:(')
                else:
                    res = requests.post(registrationResource, headers = { 'deviceId': deviceId })
                    # TODO add cases for server not found, and nice error messages
                    if res.status_code is 403:
                        printToScreenBreakLines('Device not registered, ask for help')
                    else:
                        username = res.text.replace('"', '')
                        print(username)
                    res.close()

            if (motorTimer > motorInterval):
                motor1a.high()
                motor1b.low()
                time.sleep_ms(20)
                motor1a.low()
                motor1b.low()
                motorTimer = 0
        except Exception as err:
            print(type(err))
            print(err)
            printToScreenBreakLines('An error occurred')
        # TODO do something for the heartbeat, refresh a character on the screen?
        time.sleep(1)  

button.irq(handler=button_pressed, trigger=Pin.IRQ_FALLING)
main()

