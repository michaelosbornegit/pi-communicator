import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Button, TextField, Typography } from "@mui/material";
dayjs.extend(utc)

const SendMessage = (): JSX.Element => {
    const [users, getUsers] = useState<Users>();
    const [value, setValue] = React.useState('Controlled');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    useEffect(() => {

    }, []);

    return (
        <>
            <Typography variant="h4">Enter the message you want to send</Typography>
            <TextField
                label="Enter your message"
                multiline
                rows={4}
                defaultValue="Hi..."
                onChange={handleChange}
            />
            <Button variant="outlined">Send Message!</Button>
        </>
    );
}

export default PastDaySessions;