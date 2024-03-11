import { Avatar, Box, Button, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material"
import React, { useState } from "react"
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import { IBooking } from "app/shared/model/booking.model";
import EditIcon from "@mui/icons-material/Edit"
import { useAppDispatch, useAppSelector } from "app/config/store";
import { getOneRequestDetailOfCustomer, updateAcceptForRequest, updateRejectForRequest } from "app/entities/booking/booking.reducer";
import CustomeDetailRequestCustomer from "app/shared/layout/customeDetail/custome-detail-request-customer";

interface IListTabPanelRequestOfCustomer {
    status: number
    data: IBooking[],
    editfunction?: (id: string | number) => void,
    deletefunction?: (id: string | number) => void
}


const ListTabPanelRequestOfCustomer: React.FC<IListTabPanelRequestOfCustomer> = (props) => {
    const { data, status, editfunction, deletefunction } = props
    const dispatch = useAppDispatch()
    const [open, setOpen] = useState<boolean>(false);
    const detailRequest = useAppSelector(state => state.booking.entity);

    const handleAccept = (id: string | number) => {
        dispatch(updateAcceptForRequest(id))
    }

    const handleReject = (id: string | number) => {
        dispatch(updateRejectForRequest(id))
    }


    const ActionForApproving: React.FC<{ id: number }> = (props) => {

        const { id } = props

        return (
            status === 1 ?
                <>
                    <Button onClick={() => handleAccept(id)} variant="contained" color="success">
                        Accept
                    </Button>
                    <Button onClick={() => handleReject(id)} sx={{ marginLeft: "15px" }} variant="contained" color="error">
                        Reject
                    </Button>
                </>

                : <></>
        )
    }


    const handleOpenModal = (id: string | number) => {
        setOpen(true)
        dispatch(getOneRequestDetailOfCustomer(id))
    }

    const handleOpen = () => {
        setOpen(!open)
    }
    return (
        <>
            <CustomeDetailRequestCustomer data={detailRequest} handleOpen={handleOpen} isOpen={open} title="Request detal" />
            <List dense sx={{ height: "340.125px" }}>
                {data?.length > 0 ?
                    data.map((request) => (
                        <ListItem
                            sx={{
                                paddingLeft: "7px",
                                paddingRight: "7px"
                            }}
                            key={request.id}
                            secondaryAction={
                                <>
                                    <ActionForApproving id={request.id} />
                                    {/* <IconButton edge="end" aria-label="delete">
                                        <EditIcon />
                                    </IconButton>

                                    <IconButton edge="end" aria-label="delete">
                                        <DeleteIcon />
                                    </IconButton> */}
                                </>
                            }
                        >
                            <ListItemButton onClick={() => handleOpenModal(request.id)}>
                                <ListItemAvatar>
                                    <Avatar>
                                        <FolderIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={request.customerName}
                                    secondary={request.status}
                                />


                            </ListItemButton>
                        </ListItem>

                    )) : <div></div>}

            </List>
        </>
    )
}

export default ListTabPanelRequestOfCustomer