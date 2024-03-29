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
            <List dense sx={{ height: "340.125px", overflow: "scroll" }}>
                {data?.length > 0 ?
                    data.map((room) => (
                        <ListItem
                            sx={{
                                paddingLeft: "7px",
                                paddingRight: "7px"
                            }}
                            key={room.id}
                            secondaryAction={
                                <>
                                    <IconButton sx={{ marginLeft: "10px" }} onClick={() => editfunction(room.id)} edge="end" aria-label="edit">
                                        <EditIcon />
                                    </IconButton>

                                    <IconButton onClick={() => deletefunction(room.id)} edge="end" aria-label="delete">
                                        <DeleteIcon />
                                    </IconButton>
                                </>
                            }
                        >
                            <ListItemButton onClick={() => handleDetailRoom(room.id)}>

                                <ListItemAvatar>
                                    <Avatar>
                                        <FolderIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={room.roomName}
                                    secondary={
                                        <div style={{width:"95%"}}>
                                            {room.description}
                                        </div>
                                    }
                                />
                            </ListItemButton>
                        </ListItem>

                    )) : <div></div>}

            </List>
        </>
    )

}


export default ListTabPanelRoomHost