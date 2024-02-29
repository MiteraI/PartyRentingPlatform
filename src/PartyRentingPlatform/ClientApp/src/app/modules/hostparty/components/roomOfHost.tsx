import { Avatar, Box, Button, IconButton, List, ListItem, ListItemAvatar, ListItemText, Pagination } from "@mui/material"
import { IRoom } from "app/shared/model/room.model"
import React, { useEffect, useState } from "react"
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import { TabPanel } from "./tabpanel";
import { useAppDispatch } from "app/config/store";
import { deleteEntityOfHost } from "app/entities/room/room.reducer";
import EditIcon from "@mui/icons-material/Edit"
import { Navigate, useNavigate } from "react-router";
import { reset } from "app/entities/room/room.reducer"
import ListTabPanelRoomHost from "./list_tab_panel/listTabPanelRoomHost";
import BookingCreate from "app/entities/booking/hostparty/booking-create";


interface IRoomOfHost {
    data: IRoom[],
    valuePanel: number
}


const RoomOfHost: React.FC<IRoomOfHost> = (props) => {
    const [open, setOpen] = useState<boolean>(false);

    const { data, valuePanel } = props
    const dispatch = useAppDispatch()
    const navigate = useNavigate()


    const handleBookingCreate = () => {
        setOpen(!open)
    }

    const handleDeleteRoomOfHostById = (id: string | number) => {
        dispatch(deleteEntityOfHost(id));
    }

    const handleMoveToEditRoomPage = (id: string | number) => {
        navigate(`edit/${id}`);
    }

    return (
        <>
            <BookingCreate isOpen={open} handleIsOpen={handleBookingCreate} />
            <TabPanel value={valuePanel} index={0}>
                <Box sx={{ bgcolor: 'background.paper' }}>'
                    <div style={{ width: "100%", textAlign: "end" }}>
                        <Button variant='contained' onClick={handleBookingCreate}>
                            Create new room
                        </Button>
                    </div>
                </Box>
                <ListTabPanelRoomHost data={data} editfunction={handleMoveToEditRoomPage} deletefunction={handleDeleteRoomOfHostById} />
            </TabPanel>
        </>
    )
}


export default RoomOfHost