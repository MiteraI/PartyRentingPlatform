import React, { useEffect, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntityOfHost, reset } from 'app/entities/room/room.reducer';
import { Button, Grid, } from '@mui/material';
import { IRoom } from 'app/shared/model/room.model';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import { Navigate, Route, useNavigate } from "react-router-dom"
import RoomOfHost from './components/roomOfHost';
import RequestOfCustomer from './components/requestOfCustomer';
import { Form } from 'antd';
import RoomDetail from 'app/entities/room/room-detail';
import BookingCreate from 'app/entities/booking/hostparty/booking-create';
import EditRoomOfHost from './room-edit';
import ServicesOfHost from './components/servicesOfHost';
import { Row } from 'reactstrap';
import { TabPanel } from './components/tabpanel';
import EditServiceOfHost from 'app/entities/service/hostparty/service-edit';


const HostPartyRoutes = () => {

    const [value, setValue] = React.useState(0);
    const navigate = useNavigate()

    function a11yProps(index: number) {
        return {
            id: `vertical-tab-${index}`,
            'aria-controls': `vertical-tabpanel-${index}`,
        };
    }

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleChangeRoom = () => {
        navigate("room")
    }

    const handleChangeRequestOfCustomer = () => {
        navigate("request-customer")
    }


    const handleChangeServicesOfHost = () => {
        navigate("services");
    }


    // const boxStyle: React.CSSProperties = {
    //     display: "flex",
    //     flexGrow: 1
    // }

    return (
        <Box sx={{ border: "1px solid black", padding: "20px" }}>

            <Box
                sx={{ padding: "20px 30px", flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: "auto" }}
            >

                <Tabs
                    orientation="vertical"
                    value={value}
                    onChange={handleChange}
                    aria-label="Vertical tabs example"
                    sx={{ borderRight: 1, borderColor: 'divider' }}
                >
                    <Tab onClick={handleChangeRoom} label="Room" {...a11yProps(0)} />
                    <Tab onClick={handleChangeRequestOfCustomer} label="Request of customer" {...a11yProps(1)} />
                    <Tab onClick={handleChangeServicesOfHost} label="Services" {...a11yProps(1)} />





                </Tabs>

                <TabPanel value={value} index={0} >
                    <ErrorBoundaryRoutes>
                        <Route path='room' >
                            <Route index element={<RoomOfHost valuePanel={value} />} />
                            <Route path='edit'>
                                <Route path=':id'>
                                    <Route index element={
                                        <EditRoomOfHost />
                                    }
                                    />
                                </Route>
                            </Route>
                        </Route>
                    </ErrorBoundaryRoutes>
                </TabPanel>

                <TabPanel value={value} index={1}>
                    <ErrorBoundaryRoutes>
                        <Route path="request-customer" element={<RequestOfCustomer valuePanel={value} />} />
                    </ErrorBoundaryRoutes>
                </TabPanel>

                <TabPanel value={value} index={2}>
                    <ErrorBoundaryRoutes>
                        <Route path='services'>
                            <Route index element={<ServicesOfHost valuePanel={value} />} />
                            <Route path='edit'>
                                <Route path=':id'>
                                    <Route index element={
                                        <EditServiceOfHost />
                                    }
                                    />
                                </Route>
                            </Route>
                        </Route>
                    </ErrorBoundaryRoutes>
                </TabPanel>

            </Box>
        </Box>

    )






}


export default HostPartyRoutes