import React from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { AppBar, Container, MenuItem, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
dayjs.extend(utc)

type PageRoute = {
    name: string,
    route: string,
}

const pageRoutes: PageRoute[] = [{
    name: 'Home',
    route: '/home'
}, {
    name: 'Messages',
    route: '/messages'
}, {
    name: 'Registrations',
    route: '/registrations'
}];

const NavBar = (): JSX.Element => {
    const navigate = useNavigate();

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography>NFT LAB</Typography>
                    {pageRoutes.map((page) => (
                        <MenuItem key={page.name} onClick={() => navigate(page.route)}>
                            <Typography textAlign="center">{page.name}</Typography>
                        </MenuItem>
                    ))}
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default NavBar;