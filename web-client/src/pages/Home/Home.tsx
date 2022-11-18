import styled from "@emotion/styled";
import { Paper, TextField, Typography } from "@mui/material"
import React from "react";
import SendMessage from "../../features/SendMessage/SendMessage";
import PastDaySessions from "../../features/SendMessage/SendMessage";

const Home = (): JSX.Element => {

  return (
    <>
      <Paper sx={{ padding: '50px' }}>
        <Typography variant="h2">
          Welcome to NFT Lab
        </Typography>
        <SendMessage />
      </Paper>
    </>
  )
}

export default Home;