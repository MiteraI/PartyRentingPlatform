import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import React from 'react'
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import { IRoom } from 'app/shared/model/room.model';

interface IListTabPanelRoomHost {
    data: IRoom[],
    editfunction?: (id: string | number) => void,
    deletefunction?: (id: string | number) => void
}

const ListTabPanelRoomHost: React.FC<IListTabPanelRoomHost> = (props) => {
    const { data, editfunction, deletefunction } = props

    return (
        <List dense>
            {data?.length > 0 ?
                data.map((room) => (
                    <ListItem
                        key={room.id}
                        secondaryAction={
                            <>
                                <IconButton onClick={() => editfunction(room.id)} edge="end" aria-label="delete">
                                    <EditIcon />
                                </IconButton>

                                <IconButton onClick={() => deletefunction(room.id)} sx={{ marginLeft: "15px" }} edge="end" aria-label="delete">
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
                            primary={room.roomName}
                            secondary={room.description}
                        />


                    </ListItem>)) : <div></div>}

        </List>
    )

}


export default ListTabPanelRoomHost