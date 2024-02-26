import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material"
import { IRoom } from "app/shared/model/room.model"
import React from "react"
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import { TabPanel } from "./tabpanel";


interface IRoomOfHost {
    data: IRoom[],
    valuePanel: number
}


const RoomOfHost: React.FC<IRoomOfHost> = (props) => {

    const { data, valuePanel } = props
    return (
        <TabPanel value={valuePanel} index={0}>
            <List dense>
                {data?.length > 0 ?
                    data.map((room) => (
                        <ListItem
                            key={room.id}
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
                                primary={room.roomName}
                                secondary={room.description}
                            />


                        </ListItem>)) : <div></div>}

            </List>

        </TabPanel>
    )
}


export default RoomOfHost