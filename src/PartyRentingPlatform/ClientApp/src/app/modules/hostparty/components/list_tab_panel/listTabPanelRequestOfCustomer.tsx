import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material"
import React from "react"
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import { IBooking } from "app/shared/model/booking.model";
import EditIcon from "@mui/icons-material/Edit"

interface IListTabPanelRequestOfCustomer {
    data: IBooking[],
    editfunction?: (id: string | number) => void,
    deletefunction?: (id: string | number) => void
}


const ListTabPanelRequestOfCustomer: React.FC<IListTabPanelRequestOfCustomer> = (props) => {
    const { data, editfunction, deletefunction } = props

    return (
        <List dense>
            {data?.length > 0 ?
                data.map((request) => (
                    <ListItem
                        key={request.id}
                        secondaryAction={
                            <>
                                <IconButton edge="end" aria-label="delete">
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


                    </ListItem>)) : <div></div>}

        </List>
    )
}

export default ListTabPanelRequestOfCustomer