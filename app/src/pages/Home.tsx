import { Paper, Typography } from "@mui/material"
import React from "react";
import SendMessage from "../features/SendMessage";

const Home = (): JSX.Element => {

  return (
    <>
      <Paper sx={{ padding: '50px' }}>
        <Typography variant="h2">
          Welcome to GORBY communicator
        </Typography>
        <SendMessage />
      </Paper>
    </>
  )
}

export default Home;