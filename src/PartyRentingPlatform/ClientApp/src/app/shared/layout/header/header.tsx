import './header.scss';

import React, { FC, useState } from 'react';

import { Navbar, Nav, NavbarToggler, Collapse } from 'reactstrap';
import LoadingBar from 'react-redux-loading-bar';

import { Home, Brand } from './header-components';
import { AdminMenu, EntitiesMenu, AccountMenu } from '../menus';
import { AppBar, Badge, Box, IconButton, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { AccountCircle, Search } from '@mui/icons-material';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import { useNavigate  } from "react-router-dom"
export interface IHeaderProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  ribbonEnv: string;
  isInProduction: boolean;
  isOpenAPIEnabled: boolean;
}

const Header = (props: IHeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  // const renderDevRibbon = () =>
  //   props.isInProduction === false ? (
  //     <div className="ribbon dev">
  //       <a href="">Development</a>
  //     </div>
  //   ) : null;

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const navigate = useNavigate();

  /* jhipster-needle-add-element-to-menu - JHipster will add new menu items here */



  const handleProfileMenuOpen = () => {
    navigate("/login")
  }


  return (
    <div id="app-header">
      {/* {renderDevRibbon()} */}
      <LoadingBar className="loading-bar" />

      {props.isAdmin ?
        <Navbar data-cy="navbar" dark expand="md" fixed="top" className="jh-navbar">
          <NavbarToggler aria-label="Menu" onClick={toggleMenu} />
          <Brand />
          <Collapse isOpen={menuOpen} navbar>
            <Nav id="header-tabs" className="ms-auto" navbar>
              <Home />
              {props.isAuthenticated && <EntitiesMenu />}
              {props.isAuthenticated && props.isAdmin && <AdminMenu showOpenAPI={props.isOpenAPIEnabled} />}
              <AccountMenu isAuthenticated={props.isAuthenticated} />
            </Nav>
          </Collapse>
        </Navbar>
        :
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ display: { xs: 'none', sm: 'block' } }}
              >
                MUI
              </Typography>
              <Search>

              </Search>
              <Box sx={{ flexGrow: 1 }} />
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                  <Badge badgeContent={4} color="error">
                    <MailIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  size="large"
                  aria-label="show 17 new notifications"
                  color="inherit"
                >
                  <Badge badgeContent={17} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  // aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
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
      }
    </div>
  );
};

export default Header;
