import type { DisplaySession } from "@serverTypes/session";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getPastDaySessions } from "../../services/api";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Slider, Typography } from "@mui/material";
import { HostMachines } from "@serverTypes/enums";
import styled from "@emotion/styled";
dayjs.extend(utc)

const TitleGrid = styled.div({
    display: 'flex',
    margin: 'auto',
    width: '100%',
    marginBottom: '20px',
    alignItems: 'center'
})

const TitleGridLeft = styled.div({
    display: 'flex',
    justifyContent: 'flex-start'
})

const TitleGridRight = styled.div({
    flexGrow: 1,
})

const TitleGridRightContent = styled.div({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
})

const StyledSlider = styled(Slider)({
    margin: '0 20px',
    width: '200px'
})


const PastDaySessions = ({ hostMachine }: { hostMachine: HostMachines }): JSX.Element => {
    const [session, setSession] = useState<DisplaySession>();
    const [sliderValue, setSliderValue] = useState<number[]>([-6, 0]);
    const [committedSliderValue, setCommittedSliderValue] = useState<number[]>([-6, 0]);
    const [lineColors, setLineColors] = useState<{ [id: string]: string }>({})

    useEffect(() => {
        if (!session) {
            getPastDaySessions(hostMachine, committedSliderValue[0] * -1, committedSliderValue[1] * -1).then((session) => {
                setSession(session);
                console.log(session);
            });
        }
    }, [committedSliderValue, hostMachine, session]);

    // useEffect(() => {
    //     if (session) {
    //         getPastDaySessions(hostMachine, committedSliderValue[0] * -1, committedSliderValue[1] * -1).then((session) => {
    //             setSession(session);
    //             console.log(session);
    //         });
    //     }
    // }, [committedSliderValue, hostMachine, session]);

    useEffect(() => {
        if ((session?.applicationNames.length ?? 0) > Object.keys(lineColors).length) {
            const tempLineColors: { [id: string]: string } = {};
            session?.applicationNames.forEach((name) => {
                if (!(name in Object.keys(lineColors))) {
                    tempLineColors[name] = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
                }
            });
            setLineColors({ ...lineColors, ...tempLineColors});
        }
    }, [lineColors, session])

    const handleChangeCommitted = (event: Event | SyntheticEvent<Element, Event>, newValue: number | number[]) => {
        const newSliderArray = newValue as number[];
        setCommittedSliderValue(newSliderArray);
        getPastDaySessions(hostMachine, newSliderArray[0] * -1, newSliderArray[1] * -1).then((session) => {
            setSession(session);
            console.log(session);
        });
    };

    const handleChange = (event: Event, newValue: number | number[]) => {
        setSliderValue(newValue as number[]);
    };

    return (
        <>
            {session && (
                <>
                    <TitleGrid>
                        <TitleGridLeft>
                            <Typography variant="h5" >{`Activity between ${dayjs().subtract(committedSliderValue[0] * -1, 'hours').format('hh:mm A')} and ${dayjs().subtract(committedSliderValue[1] * -1, 'hours').format('hh:mm A')} on ${hostMachine}`}</Typography>

                        </TitleGridLeft>
                        <TitleGridRight>
                            <TitleGridRightContent>
                                <Typography gutterBottom>
                                    Time Adjustment
                                </Typography>
                                <StyledSlider
                                    value={sliderValue}
                                    onChange={handleChange}
                                    onChangeCommitted={handleChangeCommitted}
                                    valueLabelDisplay="auto"
                                    min={-24}
                                    max={0}
                                />
                            </TitleGridRightContent>
                        </TitleGridRight>

                    </TitleGrid>

                    <ResponsiveContainer height={'85%'}>
                        <BarChart data={session.applicationTimeAndEndDate} barCategoryGap={0} barGap={0}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey='endCollectionDate'
                                tickFormatter={(unix) => dayjs.unix(unix).local().format('hh:mm A')} 
                                type="number"
                                domain={[dayjs().subtract(committedSliderValue[0] * -1, 'hours').unix(), dayjs().subtract(committedSliderValue[1] * -1, 'hours').unix()]}
                                />
                                
                            <YAxis />
                            <Tooltip labelFormatter={(label) => {
                                return dayjs.unix(label).local().format('hh:mm:ss A');
                            }} />
                            <Legend />

                            {session.applicationNames.map((application) => {
                                return (<Bar key={application} type="basis" stackId='a' dataKey={application} fill={lineColors && lineColors[application]} />);
                            }
                            )}
                            {/* <Bar name={'Total Time'} type="basis" stackId='a' dataKey={'totalTime'} fill={'black'} /> */}
                        </BarChart>
                    </ResponsiveContainer>
                </>
            )}
        </>
    );
}

export default PastDaySessions;