import { Badge, IconButton, Popover, Typography, List, ListItem, ListItemText, Button, ListItemIcon } from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Storage } from "react-jhipster";
import * as signalR from "@microsoft/signalr";
import React, { useEffect, useState } from "react";
import FolderIcon from '@mui/icons-material/Folder';
import axios from "axios";
enum NotificationEnum {
  THANK, REJECTED, ACCEPTED
}

interface NotifyDto {
  id: number,
  title: string,
  description: string,
  sentTime: Date,
  enum: NotificationEnum,
  userId: string
}

const NotificationHeader = (props) => {





  const [openNotification, setOpenNotification] = useState(false);
  const [notificationMessages, setNotificationMessages] = useState<NotifyDto[]>([]);

  const handleNotification = async () => {
    let jwt = Storage.session.get('jhi-authenticationToken');
    const connection = new signalR.HubConnectionBuilder()
      .withUrl('/notificationHub', { accessTokenFactory: () => jwt })
      .build();
    connection
      .start()
      .then(() => {
        console.log('Connected to SignalR Hub');
      })
      .catch(error => {
        console.error(`Error connecting to SignalR Hub: ${error}`);
      });

    await connection.on("ReceiveNotification", (message: NotifyDto) => {
      setNotificationMessages(prevMessages => [...prevMessages, message]);
    });
  };

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);


  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;


  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };


  const getAllNotiUser = async () => {
    const requestUrl = await axios.get("/api/notifications/user");
    console.log(requestUrl);

  }



  useEffect(() => {
    handleNotification();
  }, [])

  return (
    <div>
      <Button size="small" aria-describedby={id} variant="text" onClick={handleClick}>
        <IconButton
          size="small"
          edge="end"
          aria-label="account of current user"
          // aria-controls={menuId}
          aria-haspopup="true"
          color="warning"

        >
          <Badge color="error" badgeContent={notificationMessages?.length}>
            <NotificationsIcon color="warning" />
          </Badge>
        </IconButton>
      </Button>
      <Popover

        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}

        transformOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
      >
        <List sx={{ width: "325px", height: "auto", maxHeight: "300px", overflowY: "scroll" }} dense>

          {notificationMessages.length > 0
            ?
            notificationMessages.map((noti) => (
              <ListItem>
                <ListItemIcon>
                  <FolderIcon />
                </ListItemIcon>
                <ListItemText
                  sx={{ width: "300px", maxWidth: "250px", textOverflow: "ellipsis" }}
                  primary={noti?.title}
                  secondary={noti?.description}
                />
              </ListItem>
            ))

            : <div style={{ marginTop: "89px", width: "300px", height: "300px", textAlign: "center" }}>
              There is no notification
            </div>
          }

        </List>
      </Popover>
    </div>
  );
};

export default NotificationHeader;
