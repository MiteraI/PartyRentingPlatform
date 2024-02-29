import React from 'react';

import MenuItem from 'app/shared/layout/menus/menu-item';

const EntitiesMenu = () => {
  return (
    <>
      {/* prettier-ignore */}
      <MenuItem icon="asterisk" to="/admin/room">
        Room
      </MenuItem>
      <MenuItem icon="asterisk" to="/admin/room-image">
        Room Image
      </MenuItem>
      <MenuItem icon="asterisk" to="/admin/service">
        Service
      </MenuItem>
      <MenuItem icon="asterisk" to="/admin/promotion">
        Promotion
      </MenuItem>
      <MenuItem icon="asterisk" to="/admin/booking">
        Booking
      </MenuItem>
      <MenuItem icon="asterisk" to="/admin/booking-details">
        Booking Details
      </MenuItem>
      <MenuItem icon="asterisk" to="/admin/report">
        Report
      </MenuItem>
      <MenuItem icon="asterisk" to="/admin/notification">
        Notification
      </MenuItem>
      {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
    </>
  );
};

export default EntitiesMenu;
