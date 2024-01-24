import React from 'react';

import MenuItem from 'app/shared/layout/menus/menu-item';

const EntitiesMenu = () => {
  return (
    <>
      {/* prettier-ignore */}
      <MenuItem icon="asterisk" to="/room">
        Room
      </MenuItem>
      <MenuItem icon="asterisk" to="/room-image">
        Room Image
      </MenuItem>
      <MenuItem icon="asterisk" to="/service">
        Service
      </MenuItem>
      <MenuItem icon="asterisk" to="/promotion">
        Promotion
      </MenuItem>
      <MenuItem icon="asterisk" to="/booking">
        Booking
      </MenuItem>
      <MenuItem icon="asterisk" to="/booking-details">
        Booking Details
      </MenuItem>
      <MenuItem icon="asterisk" to="/report">
        Report
      </MenuItem>
      <MenuItem icon="asterisk" to="/notification">
        Notification
      </MenuItem>
      {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
    </>
  );
};

export default EntitiesMenu;
