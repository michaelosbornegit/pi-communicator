import styled from "@emotion/styled";
import { Button, Paper, TextField, Typography } from "@mui/material"
import React from "react";

const LoginPage = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  minHeight: 'calc(100vh - 50px)'
});

const LoginSection = styled(Paper)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '50px',
  '> *:not(:last-child)': {
    marginBottom: '20px'
  }
})

const Login = (): JSX.Element => {
  return (
    <>
      <LoginPage>
        <LoginSection>
          <Typography variant="h2">Log in</Typography>
          <TextField label='Code'></TextField>
          <Button href="/home">Login</Button>
        </LoginSection>
      </LoginPage>
    </>
  )
}

export default Login;
