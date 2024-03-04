import { Avatar, Box, Button, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material"
import React from "react"
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import { IBooking } from "app/shared/model/booking.model";
import EditIcon from "@mui/icons-material/Edit"
import { useAppDispatch } from "app/config/store";
import { updateAcceptForRequest, updateRejectForRequest } from "app/entities/booking/booking.reducer";

interface IListTabPanelRequestOfCustomer {
    status: number
    data: IBooking[],
    editfunction?: (id: string | number) => void,
    deletefunction?: (id: string | number) => void
}


const ListTabPanelRequestOfCustomer: React.FC<IListTabPanelRequestOfCustomer> = (props) => {
    const { data, status, editfunction, deletefunction } = props
    const dispatch = useAppDispatch()

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

    return (
        <List dense>
            {data?.length > 0 ?
                data.map((request) => (
                    <ListItemButton>
                        <ListItem
                            key={request.id}
                            secondaryAction={
                                <>
                                    <ActionForApproving id={request.id} />
                                    <IconButton sx={{ marginLeft: "15px" }} edge="end" aria-label="delete">
                                        <EditIcon />
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


                        </ListItem>
                    </ListItemButton>

                )) : <div></div>}

        </List>
    )
}

export default ListTabPanelRequestOfCustomer