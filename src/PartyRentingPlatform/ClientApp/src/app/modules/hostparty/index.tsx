import React, { useEffect, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntityOfHost } from 'app/entities/room/room.reducer';
import { Button, Grid, } from '@mui/material';
import { IRoom } from 'app/shared/model/room.model';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import { Navigate, Route, useNavigate } from "react-router-dom"
import RoomOfHost from './components/roomOfHost';
import RequestOfCustomer from './components/requestOfCustomer';
import { Form } from 'antd';
import RoomDetail from 'app/entities/room/room-detail';
import BookingCreate from 'app/entities/booking/hostparty/booking-create';


const HostPartyRoutes = () => {

    const [value, setValue] = React.useState(0);
    const [open, setOpen] = useState<boolean>(false);
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
        dispatch(getEntityOfHost({ page: 0, size: 100, sort: 'id,asc' }));
    }, [])

    const handleChangeRoom = () => {
        navigate("room")
    }

    const handleChangeRequestOfCustomer = () => {
        navigate("request-customer")
    }


    const handleBookingCreate = () => {
        setOpen(!open)
    }
    return (
        <>
           
            <BookingCreate isOpen={open} handleIsOpen={handleBookingCreate} />
            <Box sx={{ alignItems: "end", padding: "10px 50px", flexGrow: 1, bgcolor: 'background.paper' }}>'
                <div style={{ width: "100%", textAlign: "end" }}>
                    <Button variant='contained' onClick={handleBookingCreate}>
                        Create new room
                    </Button>
                </div>
            </Box>

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
                </Tabs>


                <ErrorBoundaryRoutes>
                    <Route path='room' >
                        <Route index element={<RoomOfHost valuePanel={value} data={roomListOfHost} />} />
                    </Route>
                    <Route path="request-customer" element={<RequestOfCustomer valuePanel={value} />} />
                </ErrorBoundaryRoutes>


            </Box>
        </>

    )






}


export default HostPartyRoutes