
import React, { ChangeEvent, ChangeEventHandler, useState } from "react"
import { AppBar, Autocomplete, Badge, Box, CircularProgress, IconButton, InputBase, TextField, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { AccountCircle, Image, Search } from '@mui/icons-material';
import MoreIcon from '@mui/icons-material/MoreVert';
import { json, useNavigate } from "react-router";
import CustomeSearch from "../../search/customer-search";
import { NavLink } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AuthenticateIcon from "./AuthenticateIcon";
import { Storage } from "react-jhipster";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import NotificationHeader from "./notification/notification";
import Wallet from "./wallet/wallet";

interface HeaderCustomerProps {
    isAuthenticated: boolean
}

const HeaderCustomer: React.FC<HeaderCustomerProps> = (props) => {

    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const [openWallet, setOpenWallet] = useState<boolean>(false);
    const [openNotification, setOpenNotification] = useState<boolean>(false);
    const userExisted = Storage.local.get("user")

    const handleProfileMenuOpen = () => {
        navigate("/login")
    }

    const handleFindRoom = (e) => {
        console.log(e.target.value);

    }

    const handleWalletModal = () => {
        setOpenWallet(!openWallet)
    }


    return (
        <Box sx={{ flexGrow: 1 }}>
            {userExisted ? <Wallet open={openWallet} handleClose={handleWalletModal} /> : <></>}
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

                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        {userExisted ? <NotificationHeader />
                            : <div></div>
                        }
                        {userExisted ?
                            <IconButton onClick={handleWalletModal} size="small" color="inherit">
                                <Badge color="error">
                                    <AccountBalanceWalletIcon color="warning" />
                                </Badge>
                            </IconButton>

                            : <div></div>
                        }




                        {userExisted ?
                            <AuthenticateIcon />
                            :
                            <IconButton
                                size="small"
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
                            size="small"
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


