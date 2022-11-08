import styled from "@emotion/styled";
import { Paper } from "@mui/material"
import React from "react";
import PastDaySessions from "../../features/SessionChart/SessionChart";

const SessionChartBlock = styled.div({
  margin: '20px 0',
  height: '500px'
})

const Home = (): JSX.Element => {

  return (
    <>
      <Paper sx={{ padding: '50px' }}>
        <SessionChartBlock>
          <PastDaySessions hostMachine={'MAC'} />
        </SessionChartBlock>
        <SessionChartBlock>
          <PastDaySessions hostMachine={'ANDROID'} />
        </SessionChartBlock>
      </Paper>
    </>
  )
}

export default Home;