
import React, { ChangeEvent, ChangeEventHandler, useState } from "react"
import { AppBar, Autocomplete, Badge, Box, CircularProgress, IconButton, InputBase, TextField, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { AccountCircle, Image, Search } from '@mui/icons-material';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from "react-router";
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { divide } from "lodash";
import CustomeSearch from "../../search/customer-search";
import { NavLink } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import AuthenticateIcon from "./AuthenticateIcon";

interface HeaderCustomerProps {
    isAuthenticated: boolean
}

const HeaderCustomer: React.FC<HeaderCustomerProps> = (props) => {

    const { isAuthenticated } = props

    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const loading = open && options.length === 0;

    const handleProfileMenuOpen = () => {
        navigate("/login")
    }

    const handleFindRoom = (e) => {
        console.log(e.target.value);

    }




    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar
                sx={{ backgroundColor: "#FFFFFF", padding: "10px", boxShadow: "0px 13px 23px -13px rgba(0,0,0,0.5)", }}
                position="static"
            >
                <Toolbar>

                    <NavLink to="/" style={{ textDecoration: "none" }} >
                        <Box
                            component="img"
                            alt="logo"
                            src="../../../../content/images/partyRenting.png"
                            sx={{
                                width: "200px",
                                height: "80px",
                                objectFit: "cover"
                            }}

                        />
                    </NavLink>

                    <CustomeSearch />

                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                            <Badge badgeContent={4} color="error">
                                <MailIcon color="warning" />
                            </Badge>
                        </IconButton>
                        <IconButton
                            size="large"
                            aria-label="show 17 new notifications"
                            color="inherit"
                        >
                            <Badge badgeContent={17} color="error">
                                <NotificationsIcon color="warning" />
                            </Badge>
                        </IconButton>


                        {isAuthenticated ?
                            <AuthenticateIcon />
                            :
                            <IconButton
                                size="large"
                                edge="end"
                                aria-label="account of current user"
                                // aria-controls={menuId}
                                aria-haspopup="true"
                                onClick={handleProfileMenuOpen}
                                color="warning"
                            >
                                <AccountCircleIcon />
                            </IconButton>
                        }
                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="show more"
                            // aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            // onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {/* {renderMobileMenu} */}
            {/* {renderMenu} */}
        </Box>
    )
}


export default HeaderCustomer;


