import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material'
import React, { useState } from 'react'
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import { IRoom } from 'app/shared/model/room.model';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntityDetailsOfHost, reset } from 'app/entities/room/room.reducer';
import CustomeDetail from 'app/shared/layout/customeDetail/custome-detail-room';

interface IListTabPanelRoomHost {
    data: IRoom[],
    editfunction?: (id: string | number) => void,
    deletefunction?: (id: string | number) => void
}

const ListTabPanelRoomHost: React.FC<IListTabPanelRoomHost> = (props) => {
    const { data, editfunction, deletefunction } = props
    const [open, setOpen] = useState<boolean>(false)
    const dispatch = useAppDispatch()
    const detailRoomOfHost = useAppSelector(state => state.room.entityDetailsOfHost) as IRoom;

    const handleDetailRoom = (id: string | number) => {
        dispatch(getEntityDetailsOfHost(id))
        setOpen(true)
    }

    const handleOpenDetail = () => {
        setOpen(!open)
    }
    return (
        <>
            <CustomeDetail data={detailRoomOfHost} handleOpen={handleOpenDetail} isOpen={open} title="Room detail" />
            <List dense sx={{ height: "340.125px" }}>

                {data?.length > 0 ?
                    data.map((room) => (
                        <ListItemButton onClick={() => handleDetailRoom(room.id)}>
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
                            </ListItem>
                        </ListItemButton>

                    )) : <div></div>}

            </List>
        </>
    )

}


export default ListTabPanelRoomHost