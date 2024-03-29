import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import RoomImage from './room-image';
import Service from './service';
import Promotion from './promotion';
import Booking from './booking';
import BookingDetails from './booking-details';
import Report from './report';
import Notification from './notification';
import RoomRoutes from './room';
; // Import component

/* jhipster-needle-add-route-import - JHipster will add routes here */

export default () => {
  return (
    <div>
      <ErrorBoundaryRoutes>
        {/* prettier-ignore */}
        <Route path="room/*" element={<RoomRoutes />} />
        <Route path="room-image/*" element={<RoomImage />} />
        <Route path="service/*" element={<Service />} />
        <Route path="promotion/*" element={<Promotion />} />
        <Route path="booking/*" element={<Booking />} />
        <Route path="booking-details/*" element={<BookingDetails />} />
        <Route path="report/*" element={<Report />} />
        <Route path="notification/*" element={<Notification />} />
        {/* jhipster-needle-add-route-path - JHipster will add routes here */}
      </ErrorBoundaryRoutes>
    </div>
  );
};
