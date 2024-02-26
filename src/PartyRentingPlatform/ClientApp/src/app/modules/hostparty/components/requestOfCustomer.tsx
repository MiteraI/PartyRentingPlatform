import React, { useEffect, useState } from "react"
import { TabPanel } from "./tabpanel"
import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import { useAppDispatch, useAppSelector } from "app/config/store";
import { getRequestOfCustomer } from "app/entities/booking/booking.reducer";
import { IBooking } from "app/shared/model/booking.model";


interface IRequestOfCustomer {
    valuePanel: number
}


const RequestOfCustomer: React.FC<IRequestOfCustomer> = (props) => {
    const { valuePanel } = props
    const dispatch = useAppDispatch()
    const requestOfCustomer = useAppSelector((state) => state.booking.entities) as IBooking[]

    useEffect(() => {
        dispatch(getRequestOfCustomer({ page: 0, size: 100, sort: "id,asc" }))
    }, [])


    return (
        <TabPanel value={valuePanel} index={1}>
            <List dense>
                {requestOfCustomer?.length > 0 ?
                    requestOfCustomer.map((request) => (
                        <ListItem
                            key={request.id}
                            secondaryAction={
                                <>
                                    <IconButton edge="end" aria-label="delete">
                                        <DeleteIcon />
                                    </IconButton>

                                    <IconButton sx={{ marginLeft: "15px" }} edge="end" aria-label="delete">
                                        <DeleteIcon />
                                    </IconButton>
                                </>
                            }
                        >

                            <ListItemAvatar>
                                <Avatar>
                                    <FolderIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={request.customerName}
                                secondary={request.status}
                            />


                        </ListItem>)) : <div></div>}

            </List>
        </TabPanel>

    )
}

export default RequestOfCustomer