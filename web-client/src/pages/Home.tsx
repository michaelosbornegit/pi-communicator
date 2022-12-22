import styled from "@emotion/styled";
import { Button, Paper, TextField, Typography } from "@mui/material"
import { Message } from "@serverTypes/message";
import React, { useEffect, useRef, useState } from "react";
import { getMessages, readMessage, register } from "../services/api";

const SendContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
});

const inactivityTimeout = 5;

const Home = (): JSX.Element => {
  let username = useRef<string>();
  let messages = useRef<Message[]>([]);
  let readingMessages = useRef<boolean>(false);
  let inactivityCounter = useRef<number>(0);
  const [display, setDisplay] = useState<string>();
  const [intervalId, setIntervalId] = useState<NodeJS.Timer>();

  const handleActionButton = () => {
    inactivityCounter.current = 0;
    if (readingMessages.current) {
      // mark message as read, show next message if it exists
      if (messages.current && messages.current.length > 0) {
        readMessage(messages.current[0].id);
        if (messages.current.length > 1) {
          setDisplay(
            `${messages.current[1].message}
${messages.current[1].from}`);
          messages.current = messages.current.slice(1);
        } else {
          setDisplay('No new messages...');
          messages.current = messages.current.slice(1);
          readingMessages.current = false;
        }
      }
    } else if (messages.current.length > 0) {
      // display first unread message if it exists
      setDisplay(
      `${messages.current[0].message}
${messages.current[0].from}`);
    }

    readingMessages.current = true;
  }

  useEffect(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    
    const newIntervalId = setInterval(async function() {
      if (readingMessages.current) {
        inactivityCounter.current = inactivityCounter.current + 1;
        if (inactivityCounter.current > inactivityTimeout) {
          readingMessages.current = false;
          inactivityCounter.current = 0;
        }
      } else {
        if (username.current) {
          const newMessages = await getMessages(username.current);
          messages.current = newMessages;
          if (!readingMessages.current) {
            if (newMessages.length > 0) {
              setDisplay('You have new messages!');
            } else {
              setDisplay('No new messages...');
            }
          }
        } else {
          register().then((newUsername) => {
            if (newUsername) {
              username.current = newUsername;
            } else {
              setDisplay('Device not registered, please register this device');
            }
          })
        }
      }
      setIntervalId(newIntervalId);
    }, 1000);
  }, []);

  return (
    <>
      <Paper sx={{ padding: '50px' }}>
        <Typography variant="h2">
          Test client
        </Typography>
        <Typography variant="h2">
          Message:
        </Typography>
        <SendContainer>
        <TextField 
          multiline
          rows={4} 
          disabled={true} 
          value={display}
          />
        <Button onClick={() => handleActionButton()}>
          Action Button
        </Button>
        </SendContainer>
      </Paper>
    </>
  )
}

export default Home;