import * as React from 'react';
import { Dropdown } from '@mui/base/Dropdown';
import { Menu } from '@mui/base/Menu';
import { MenuButton as BaseMenuButton } from '@mui/base/MenuButton';
import { MenuItem as BaseMenuItem, menuItemClasses } from '@mui/base/MenuItem';
import { styled } from '@mui/system';
import PersonIcon from '@mui/icons-material/Person';
import { useDispatch } from 'react-redux';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { logout } from 'app/shared/reducers/authentication';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES, ROLES } from 'app/config/constants';
import { useNavigate } from 'react-router';
import { Storage } from 'react-jhipster';
import { Link } from 'react-router-dom';
export default function AuthenticateIcon() {

  const dispatch = useAppDispatch();
  const navigate = useNavigate()
  const roles = Storage.local.get("roles");
  const isHostParyRole = roles?.includes(AUTHORITIES.HOST);

  
  const handelLogOut = () => {
    dispatch(logout());
    window.location.href = "/"
  }

  const handleBookingHisory = () => {
    navigate('room/booking-list');
  }

  const handleGoToProfile = () => {
    navigate('profile');
  }

  const handleNavigateToDashboard = () => {
    navigate("hostparty/room");
  }


  return (
    <Dropdown>
      <MenuButton>
        <PersonIcon color='warning' />
      </MenuButton>
      <Menu style={{ position: "relative", zIndex: 10 }} slots={{ listbox: Listbox }}>
        <MenuItem onClick={handleGoToProfile} component={Link} to={`profile/1`}>Profile</MenuItem>
        {/* <MenuItem >Profile</MenuItem> */}
        <MenuItem onClick={handleBookingHisory} component={Link} to={`room/booking-list`}>
          Booking History
        </MenuItem>

        {/* if host party == dashboard of host party */}
        {isHostParyRole && <MenuItem onClick={handleNavigateToDashboard}>Dashboard</MenuItem>}
        <MenuItem onClick={handelLogOut}>Log out</MenuItem>
      </Menu>
    </Dropdown>
  );
}

const blue = {
  50: '#F0F7FF',
  100: '#C2E0FF',
  200: '#99CCF3',
  300: '#66B2FF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E6',
  700: '#0059B3',
  800: '#004C99',
  900: '#003A75',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const Listbox = styled('ul')(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  padding: 6px;
  margin: 12px 0;
  min-width: 200px;
  border-radius: 12px;
  overflow: auto;
  outline: 0px;
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  box-shadow: 0px 4px 6px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.50)' : 'rgba(0,0,0, 0.05)'
    };
  `,
);

const MenuItem = styled(BaseMenuItem)(
  ({ theme }) => `
  list-style: none;
  padding: 8px;
  border-radius: 8px;
  cursor: default;

  &:last-of-type {
    border-bottom: none;
  }

  &:focus {
    outline: 3px solid ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
    background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[100]};
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  }

  &.${menuItemClasses.disabled} {
    color: ${theme.palette.mode === 'dark' ? grey[700] : grey[400]};
  }
  `,
);

const MenuButton = styled(BaseMenuButton)(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.5;
  color: white;
  transition: all 150ms ease;
  cursor: pointer;
  
  border: none;
  background-color:unset;


  &:hover {
    background: #F3F6F9;
    border-radius: 50% ;
  }

 
  `,
);