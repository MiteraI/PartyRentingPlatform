import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material"
import React from "react"
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import { IBooking } from "app/shared/model/booking.model";
import EditIcon from "@mui/icons-material/Edit"
import { IService } from "app/shared/model/service.model";
import { formatCurrency } from "app/shared/util/currency-utils";

interface IListTabPanelServicesOfCustomer {
    data: IService[],
    editfunction?: (id: string | number) => void,
    deletefunction?: (id: string | number) => void
}


const ListTabPanelServiceOfCustomer: React.FC<IListTabPanelServicesOfCustomer> = (props) => {
    const { data, editfunction, deletefunction } = props

    return (
        <List dense sx={{ height: "340.125px" }}>
            {data?.length > 0 ?
                data.map((service) => (
                    <ListItem
                        sx={{
                            paddingLeft: "7px",
                            paddingRight: "7px"
                        }}
                        key={service.id}
                        secondaryAction={
                            <>
                                <IconButton onClick={() => editfunction(service.id)} edge="end" aria-label="delete">
                                    <EditIcon />
                                </IconButton>

                                <IconButton onClick={() => deletefunction(service.id)} edge="end" aria-label="delete">
                                    <DeleteIcon />
                                </IconButton>
                            </>
                        }
                    >

                        <ListItemButton>
                            <ListItemAvatar>
                                <Avatar>
                                    <FolderIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={service.serviceName}
                                secondary={`Price: ${formatCurrency(service.price)} & Description: ${service.description}`}

                            />
                        </ListItemButton>
                    </ListItem>

                )) : <div></div>}

        </List>
    )
}

export default ListTabPanelServiceOfCustomer