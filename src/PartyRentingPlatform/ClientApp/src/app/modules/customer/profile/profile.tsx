import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Box, Avatar, Typography, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, Chip } from '@mui/material';
import { Button, Layout, Menu } from 'antd';
import { UserOutlined, MailOutlined } from '@ant-design/icons';


import type { Styles as ReactModalStyles } from 'react-modal';

import { styled } from '@mui/system';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const { Content, Sider } = Layout;

const StyledRoomDetail = styled('div')(({ theme }) => ({
    padding: '70px',
    paddingTop: '0',
    [theme.breakpoints.down('sm')]: {
        padding: '15px',
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
const handleBecomeHost = async () => {
    try {
        await axios.put('/api/profile/become-host');
        // Nếu API trả về OK, bạn có thể thực hiện các bước cập nhật giao diện hoặc hiển thị thông báo thành công
        console.log('Successfully become host');
    } catch (error) {
        console.error('Error becoming host:', error);
        // Xử lý lỗi, có thể hiển thị thông báo lỗi cho người dùng
    }
};

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [isPartyHost, setIsPartyHost] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('/api/profile');
                setProfile(response.data);

                // Kiểm tra nếu authorities chứa 'ROLE_HOST'
                setIsPartyHost(response.data?.authorities?.includes('ROLE_HOST'));
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
        fetchProfile();
    }, []); // Chạy useEffect chỉ một lần khi component được mount

    console.log(profile);

    return (
        <StyledRoomDetail>
            <Layout style={{ backgroundColor: 'transparent' }}>
                <Sider width={435} theme="light" style={{ backgroundColor: 'transparent' }}>
                    <Box mb={5} style={{ boxShadow: 'rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px', padding: '24px', borderRadius: '30px' }} display="flex" flexDirection="column" alignItems="center" height="40vh" justifyContent="center">
                        <Avatar src={profile?.imageUrl} style={{ width: '130px', height: '130px' }} alt="User Avatar" />
                        <Typography variant="h4" mt={1} textAlign="center"><strong>{profile?.firstName + ' ' + profile?.lastName}</strong></Typography>
                        <Typography variant="subtitle1" mt={1} textAlign="center">{/* Empty, or any other information you want to display */}</Typography>
                        <Box>
                            {profile?.authorities?.map((role, index) => (
                                <Chip key={index} label={role === 'ROLE_HOST' ? 'Host' : 'User'} color={role === 'ROLE_HOST' ? 'primary' : 'default'} style={{ margin: '4px' }} />
                            ))}
                        </Box>
                    </Box>
                    <Divider />
                    <Box style={{ boxShadow: 'rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px', padding: '24px', borderRadius: '30px' }}>
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <MailOutlined />
                                </ListItemIcon>
                                <ListItemText primary={profile?.email} />
                            </ListItem>
                        </List>
                        <List>
                            <ListItem button component={Link} to="/room/booking-list">
                                <ListItemIcon>
                                    <UserOutlined />
                                </ListItemIcon>
                                <ListItemText primary="Booking List" />
                            </ListItem>
                        </List>
                        {/* <List>
                            <ListItem>
                                <Typography variant="subtitle1" gutterBottom>
                                    Roles:
                                </Typography>
                                <Box>
                                    {profile?.authorities?.map((role, index) => (
                                        <Chip key={index} label={role === 'ROLE_HOST' ? 'Host' : 'User'} color={role === 'ROLE_HOST' ? 'primary' : 'default'} style={{ margin: '4px' }} />
                                    ))}
                                </Box>
                            </ListItem>
                        </List> */}
                    </Box>
                </Sider>
                <Layout style={{ backgroundColor: 'transparent' }}>
                    <Content style={{ paddingLeft: '100px' }}>
                        <Typography></Typography>
                        <Typography variant="h4" mt={1} textAlign="left"><strong>{'About ' + profile?.firstName}</strong></Typography>
                        <Button
                            size="large"
                            style={{ width: '120px', borderColor: 'black', backgroundColor: '#fafafa', color: 'black', height: '48px', borderRadius: '10px', marginBottom: '10px', marginTop: '20px' }}
                        >
                            Edit Profile
                        </Button>
                        {!isPartyHost && (
                            <Button
                                size="large"
                                onClick={handleBecomeHost}
                                style={{ width: '120px', borderColor: 'black', backgroundColor: '#fafafa', color: 'black', height: '48px', borderRadius: '10px', marginBottom: '10px', marginTop: '20px' }}
                            >
                                Become Host
                            </Button>
                        )}
                    </Content>
                </Layout>
            </Layout>
        </StyledRoomDetail>
    );
};

export default Profile;
