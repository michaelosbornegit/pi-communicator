import styled from "@emotion/styled";
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material"
import React, { useEffect, useState } from "react";
import { Registration } from "@serverTypes/registration";
import { getRegistrations } from "../services/api";

const Registrations = (): JSX.Element => {
    const [registrations, setRegistrations] = useState<Registration[]>([]);

    useEffect(() => {
        if (registrations.length === 0) {
            getRegistrations().then((fetched) => {
                setRegistrations(fetched);
            })
        }
    }, [registrations]);

    return (
        <>
            <Paper sx={{ padding: '50px' }}>
                <Typography variant="h2">
                    Registrations
                </Typography>
                <TableContainer>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>DeviceId</TableCell>
                                <TableCell align="right">Username</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {registrations.map((registration) => (
                                <TableRow
                                    key={registration.deviceId}
                                >
                                    <TableCell scope="row">
                                        {registration.deviceId}
                                    </TableCell>
                                    <TableCell align="right">{registration.username ?? '[undefined]'}</TableCell>
                                    {/* {registration.username ? (
                                        <TableCell align="right">{registration.username}</TableCell>
                                    ) : (
                                        <TableCell>
                                            <TextField />
                                            <Button onClick={() => updateUsername(registration)}>Submit</Button>
                                        </TableCell>
                                    )} */}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </>
    )
}

export default Registrations;