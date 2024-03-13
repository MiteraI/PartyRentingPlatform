import { Badge, IconButton, Popover, Typography, List, ListItem, ListItemText } from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Storage } from "react-jhipster";
import * as signalR from "@microsoft/signalr";
import React, { useState } from "react";

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

  const handleNotification = () => {
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

    connection.on("ReceiveMessage", (message: NotifyDto) => {
      console.log(message);
      setNotificationMessages(prevMessages => [...prevMessages, message]);
    });
    // setOpenNotification(!openNotification)
  };

  const handleNotificationIconClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenNotification(!openNotification);
  };

  const handleCloseNotification = () => {
    setOpenNotification(false);
  };

  return (
    <>
      <IconButton
        size="small"
        aria-label="show 17 new notifications"
        color="inherit"
        onClick={handleNotificationIconClick}
      >
        <Badge color="error" badgeContent={notificationMessages.length}>
          <NotificationsIcon color="warning" />
        </Badge>
      </IconButton>
      <Popover
        open={openNotification}
        anchorEl={null}
        onClose={handleCloseNotification}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <List>
          {notificationMessages.map((message: NotifyDto) => (
            <ListItem key={message.id}>
              <ListItemText
                primary={message.title}
                secondary={message.description}
              />
            </ListItem>
          ))}
        </List>
      </Popover>
    </>
  );
};

export default NotificationHeader;
