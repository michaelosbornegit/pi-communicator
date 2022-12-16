import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { Registration } from '@serverTypes/registration';
import { getRegistrations, sendMessage } from "../services/api";
import styled from "@emotion/styled";
dayjs.extend(utc)

const SendContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
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
        <>
            <Typography variant="h4">Recipient:</Typography>
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
            <Typography variant="h4">Message:</Typography>
            <SendContainer>
            <TextField
                label="Enter your message"
                multiline
                rows={4}
                sx={{width: '20rem'}}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <TextField
                label="From"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
            />
            <Button variant="outlined" onClick={() => {handleMessageSend()}}>Send Message!</Button>
            </SendContainer>
        </>
    );
}

export default SendMessage;