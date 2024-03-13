import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Storage } from 'react-jhipster';

import { Box, Avatar, Typography, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, Chip, TextField } from '@mui/material';
import { Button, Layout, Menu } from 'antd';
import { UserOutlined, MailOutlined } from '@ant-design/icons';

import { toast } from 'react-toastify';

import { styled } from '@mui/system';


const StyledRoomDetail = styled('div')(({ theme }) => ({
    padding: '70px',
    paddingTop: '0',
    [theme.breakpoints.down('sm')]: {
        padding: '15px',
    },
    backgroundColor: 'transparent',
}));

const { Content, Sider } = Layout;

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [isPartyHost, setIsPartyHost] = useState(false);
    const [editFormVisible, setEditFormVisible] = useState(false);
    const [editedProfile, setEditedProfile] = useState({ firstName: '', lastName: '' });
    const [avatar, setAvatar] = useState(null); // Thêm state hook để lưu trữ avatar mới
    const fileInputRef = useRef(null); // Ref để truy cập vào thẻ input file
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarUpdated, setAvatarUpdated] = useState(false); // State để theo dõi việc cập nhật avatar đã hoàn thành hay chưa


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('/api/profile');
                setProfile(response.data);
                setIsPartyHost(response.data?.authorities?.includes('ROLE_HOST'));
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
        fetchProfile();
    }, []);

    const handleEditProfile = () => {
        setEditedProfile({ firstName: profile.firstName, lastName: profile.lastName });
        setEditFormVisible(true);
    };

    const handleCancelEdit = () => {
        setEditFormVisible(false);
    };

    const handleConfirmEdit = async () => {
        try {
            const editedData = { ...editedProfile, id: profile?.id, login: Storage.local.get("user") };

            const res = await axios.put('/api/profile', editedData);
            console.log('Profile updated successfully');
            setProfile({ ...profile, ...editedData });
            setEditFormVisible(false);
            if (res.status === 200) {
                toast.success("Cập nhật thành công");
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error("Cập nhật không thành công");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    };

    const handleBecomeHost = async () => {
        try {
            const res = await axios.put('/api/profile/become-host');
            if (res.status === 200) {
                toast.success("Bạn đã cập nhật thành host party")
            }
        } catch (error) {
            toast.error('Error becoming host:', error);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    const handleAvatarSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append('avatar', avatarFile);

            const response = await axios.post('/api/profile/avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                toast.success("Avatar updated successfully");
                setAvatarUpdated(true); // Đã cập nhật avatar thành công
                // setAvatarFile(null);
            }
        } catch (error) {
            console.error('Error updating avatar:', error);
            toast.error("Failed to update avatar");
        }
    };

    const handleUploadAvatar = (e) => {
        const file = e.target.files[0];
        setAvatarFile(file);
    };

    return (
        <StyledRoomDetail>
            <Layout style={{ backgroundColor: 'transparent' }}>
                <Sider width={435} theme="light" style={{ backgroundColor: 'transparent' }}>
                    <Box mb={5} style={{ boxShadow: 'rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px', padding: '24px', borderRadius: '30px' }} display="flex" flexDirection="column" alignItems="center" height="40vh" justifyContent="center">
                        <Avatar src={avatarUpdated ? URL.createObjectURL(avatarFile) : profile?.imageUrl} style={{ width: '130px', height: '130px', cursor: 'pointer' }} alt="User Avatar" onClick={handleAvatarClick} />
                        <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleUploadAvatar} />
                        {avatarFile && ( // Hiển thị nút "Submit" chỉ khi avatarFile khác null
                            <Button
                                size="large"
                                style={{ width: '120px', borderColor: 'black', backgroundColor: '#fafafa', color: 'black', height: '48px', borderRadius: '10px', marginBottom: '10px', marginTop: '20px' }}
                                onClick={handleAvatarSubmit}>Submit</Button>
                        )}
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
                    </Box>
                </Sider>
                <Layout style={{ backgroundColor: 'transparent' }}>
                    <Content style={{ paddingLeft: '100px' }}>
                        <Typography></Typography>
                        <Typography variant="h4" mt={1} textAlign="left"><strong>{'About ' + profile?.firstName}</strong></Typography>
                        <Button
                            size="large"
                            onClick={handleEditProfile}
                            style={{ width: '120px', borderColor: 'black', backgroundColor: '#fafafa', color: 'black', height: '48px', borderRadius: '10px', marginBottom: '10px', marginTop: '20px', marginRight: '20px' }}
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
                        {editFormVisible && (
                            <Box mt={2}>
                                <TextField
                                    label="First Name"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    name="firstName"
                                    value={editedProfile.firstName}
                                    onChange={handleInputChange}
                                />
                                <TextField
                                    label="Last Name"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    name="lastName"
                                    value={editedProfile.lastName}
                                    onChange={handleInputChange}
                                />
                                <Button onClick={handleCancelEdit} style={{ marginRight: '10px' }}>Cancel</Button>
                                <Button onClick={handleConfirmEdit} type="primary">Confirm</Button>
                            </Box>
                        )}



                    </Content>
                </Layout>
            </Layout>
        </StyledRoomDetail>
    );
};

export default Profile;
