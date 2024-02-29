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


const HostPartyRoutes = () => {

    const [value, setValue] = React.useState(0);
    const dispatch = useAppDispatch();
    const roomListOfHost = useAppSelector(state => state.room.entitiesOfHost) as IRoom[];
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




    useEffect(() => {

        // use to delete the entity of room detail of host
        dispatch(reset());
        dispatch(getEntityOfHost({ page: 0, size: 100, sort: 'id,asc' }));
    }, [])

    const handleChangeRoom = () => {
        navigate("room")
    }

    const handleChangeRequestOfCustomer = () => {
        navigate("request-customer")
    }


    const handleChangeServicesOfHost = () => {
        navigate("services");
    }

   
    return (
        <Box sx={{ border: "1px solid black", padding: "20px" }}>

            <Box
                sx={{ padding: "10px 50px", flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: "auto" }}
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


                <ErrorBoundaryRoutes>
                    <Route path='room' >
                        <Route index element={<RoomOfHost valuePanel={value} data={roomListOfHost} />} />
                    </Route>
                    <Route path="request-customer" element={<RequestOfCustomer valuePanel={value} />} />
                    <Route path='services' element={<ServicesOfHost valuePanel={value} />} />
                </ErrorBoundaryRoutes>


            </Box>
        </Box>

    )






}


export default HostPartyRoutes