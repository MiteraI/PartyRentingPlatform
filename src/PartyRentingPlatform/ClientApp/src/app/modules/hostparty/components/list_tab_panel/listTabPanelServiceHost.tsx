import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material"
import React from "react"
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import { IBooking } from "app/shared/model/booking.model";
import EditIcon from "@mui/icons-material/Edit"
import { IService } from "app/shared/model/service.model";

interface IListTabPanelServicesOfCustomer {
    data: IService[],
    editfunction?: (id: string | number) => void,
    deletefunction?: (id: string | number) => void
}


const ListTabPanelServiceOfCustomer: React.FC<IListTabPanelServicesOfCustomer> = (props) => {
    const { data, editfunction, deletefunction } = props

    return (
        <List dense>
            {data?.length > 0 ?
                data.map((service) => (
                    <ListItem
                        key={service.id}
                        secondaryAction={
                            <>
                                <IconButton onClick={() => editfunction(service.id)} edge="end" aria-label="delete">
                                    <EditIcon />
                                </IconButton>

                                <IconButton onClick={() => deletefunction(service.id)} sx={{ marginLeft: "15px" }} edge="end" aria-label="delete">
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
                            primary={service.serviceName}
                            secondary={service.description}
                        />


                    </ListItem>)) : <div></div>}

        </List>
    )
}

export default ListTabPanelServiceOfCustomer