import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { Registration } from '@serverTypes/registration';
import { getRegistrations, sendMessage } from "../services/api";
import styled from "@emotion/styled";
dayjs.extend(utc)

const Container = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
})

const FormContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '16em'
});

const SendMessage = (): JSX.Element => {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [usernameTo, setUsernameTo] = useState<string>('');
    const [from, setFrom] = useState<string>();
    const [message, setMessage] = useState<string>();

    const handleUserChange = (event: { target: { value: unknown } }) => {
        setUsernameTo(String(event.target.value));
    };

    const handleMessageSend = () => {
        // TODO throw if fields aren't filled
        if (!usernameTo || !from || !message) {
            throw new Error('Required Fields not filled out');

        }
        sendMessage({
            to: usernameTo,
            from,
            message
        })
    };

    const formatMessage = (message: string) => {
        const lines = message.split('\n');
        for (let i = 0; i < 4; i++) {
            if (lines[i]) {
                let line = lines[i];
                if (line.length > 16) {
                    // Too long for display, try to split on spaces
                    let words = line.split(' ');
                    if (words.length > 1) {
                        // Put last word on new line
                        const slicedWord = words[words.length - 1];
                        words = words.slice(0, -1);
                        const space = lines[i + 1] ? ' ' : '';
                        lines[i + 1] = slicedWord + space + (lines[i + 1] || '');
                        lines[i] = words.join(' ');
                    } else {
                        const extra = line.substring(16);
                        lines[i] = line.substring(0, 16)
                        lines[i + 1] = extra + (lines[i + 1] || '');
                    }
                }
            }
        }
        const firstLines = lines.slice(0, 4)
        const processedMessage = firstLines.join('\n');  

        setMessage(processedMessage);
    }

    const formatFrom = (from: string) => {
        if (from.length > 9) {
            setFrom(from.substring(0, 9));
        } else {
            setFrom(from);
        }
    }

    useEffect(() => {
        if (registrations.length === 0) {
            getRegistrations().then((fetched) => {
                setRegistrations(fetched);
                if (fetched.length > 0) {
                    setUsernameTo(fetched[0].username ?? '');
                }
            })
        }
    }, [registrations]);

    return (
        <Container>
            <Typography>Recipient:</Typography>
            <FormContainer>
                <FormControl fullWidth>
                    <InputLabel>User</InputLabel>
                    <Select
                        value={usernameTo}
                        label="User"
                        onChange={(e) => handleUserChange(e)}
                    >
                        {
                            registrations.map((registration) => {
                                if (registration.username) {
                                    return <MenuItem key={registration.username} value={registration.username}>{registration.username}</MenuItem>
                                }
                                return <></>
                            })
                        }
                    </Select>
                </FormControl>
            </FormContainer>
            <Typography>Message:</Typography>
            <FormContainer>
                <TextField
                    label="Enter your message"
                    multiline
                    rows={4}
                    value={message}
                    onChange={(e) => formatMessage(e.target.value)}
                />
                <TextField
                    label="From"
                    value={from}
                    onChange={(e) => formatFrom(e.target.value)}
                />
                <Button variant="outlined" onClick={() => { handleMessageSend() }}>Send Message!</Button>
            </FormContainer>
        </Container>
    );
}

export default SendMessage;