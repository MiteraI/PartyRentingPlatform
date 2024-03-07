import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Avatar, Typography, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { HomeOutlined, BookmarkBorderOutlined, ExitToAppOutlined } from '@mui/icons-material';
import { Layout, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import type { Styles as ReactModalStyles } from 'react-modal';

import { styled } from '@mui/system';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
// import 'antd/dist/antd.css';

const { Content, Sider } = Layout;

const StyledRoomDetail = styled('div')(({ theme }) => ({
    padding: '30px', // Default padding for larger screens
    paddingTop: '0',
    [theme.breakpoints.down('sm')]: {
        padding: '15px', // Adjust padding for smaller screens
    },
}));

const modalStyles: ReactModalStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};


const Profile = () => {
    return (
        <StyledRoomDetail>
            <Layout>
                <Sider width={80} theme="light">
                    <Box display="flex" flexDirection="column" alignItems="center" height="100vh" justifyContent="center">
                        <Avatar src="https://example.com/avatar.jpg" alt="User Avatar" />
                        <Typography variant="subtitle2" mt={1} textAlign="center">Full Name</Typography>
                    </Box>
                    <Divider />
                    <Menu defaultSelectedKeys={['1']} mode="vertical" theme="light">
                        <Menu.Item key="1" icon={<HomeOutlined />} />
                        <Menu.Item key="2" icon={<BookmarkBorderOutlined />} />
                    </Menu>
                    <Divider />
                    <List>
                        <ListItem button component={Link} to="/booking-list">
                            <ListItemIcon>
                                <UserOutlined />
                            </ListItemIcon>
                            <ListItemText primary="Booking List" />
                        </ListItem>
                    </List>
                    <Divider />
                    <List>
                        <ListItem button>
                            <ListItemIcon>
                                <ExitToAppOutlined />
                            </ListItemIcon>
                            <ListItemText primary="Logout" />
                        </ListItem>
                    </List>
                </Sider>
                <Layout>
                    <Content style={{ padding: '24px' }}>
                        Ôi giờ phút trong tay anh đầu tiên một cuộc đời êm ấm
                    </Content>
                </Layout>
            </Layout>
        </StyledRoomDetail>
    );
};

export default Profile;
