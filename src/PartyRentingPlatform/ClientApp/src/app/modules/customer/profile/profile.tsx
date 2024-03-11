import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Avatar, Typography, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Button, Layout, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import type { Styles as ReactModalStyles } from 'react-modal';

import { styled } from '@mui/system';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import 'antd/dist/antd.css';

const { Content, Sider } = Layout;

const StyledRoomDetail = styled('div')(({ theme }) => ({
    padding: '70px', // Default padding for larger screens
    paddingTop: '0',
    [theme.breakpoints.down('sm')]: {
        padding: '15px', // Adjust padding for smaller screens
    },
    backgroundColor: 'transparent',
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
            <Layout style={{ backgroundColor: 'transparent' }}>
                <Sider width={435} theme="light" style={{ backgroundColor: 'transparent' }}>
                    {/* <div > */}
                    <Box mb={5} style={{ boxShadow: 'rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px', padding: '24px', borderRadius: '30px' }} display="flex" flexDirection="column" alignItems="center" height="40vh" justifyContent="center">
                        <Avatar src="https://th.bing.com/th/id/OIP.SpSNWPX1xWOtgswzc4Qu6wHaHx?rs=1&pid=ImgDetMain"
                            style={{ width: '130px', height: '130px' }} alt="User Avatar" />
                        <Typography variant="h4" mt={1} textAlign="center"><strong>Trương Lê Tuấn Kiệt</strong></Typography>
                        <Typography variant="subtitle1" mt={1} textAlign="center">Guest</Typography>

                    </Box>
                    {/* </div> */}
                    <Divider />
                    <Box style={{ boxShadow: 'rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px', padding: '24px', borderRadius: '30px' }}>
                        {/* <Menu defaultSelectedKeys={['1']} mode="vertical" theme="light">
                            <Menu.Item key="1" icon={<HomeOutlined />} />
                            <Menu.Item key="2" icon={<BookmarkBorderOutlined />} />
                        </Menu> */}
                        {/* <Divider /> */}
                        <List>
                            <ListItem button component={Link} to="/room/booking-list">
                                <ListItemIcon>
                                    <UserOutlined />
                                </ListItemIcon>
                                <ListItemText primary="Booking List" />
                            </ListItem>
                        </List>
                        {/* <Divider /> */}
                        {/* <List>
                            <ListItem button>
                                <ListItemIcon>
                                    <ExitToAppOutlined />
                                </ListItemIcon>
                                <ListItemText primary="Logout" />
                            </ListItem>
                        </List> */}
                    </Box>
                </Sider>
                <Layout style={{ backgroundColor: 'transparent' }}>
                    <Content style={{ paddingLeft: '100px' }}>
                        <Typography></Typography>
                        <Typography variant="h4" mt={1} textAlign="left"><strong>About Tuấn Kiệt</strong></Typography>
                        <Button
                            // color="white"
                            size="large"
                            // data-cy="bookButton"
                            
                            // onClick={handleBookClick}
                            style={{ width: '120px', borderColor: 'black', backgroundColor: '#fafafa', color: 'black', height: '48px',  borderRadius: '10px', marginBottom: '10px', marginTop: '20px' }}
                        >
                            Edit Profile
                        </Button>
                        
                    </Content>
                </Layout>
            </Layout>
        </StyledRoomDetail>
    );
};

export default Profile;
