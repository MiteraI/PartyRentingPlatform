import React from 'react';

import { Route } from 'react-router-dom';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import UserManagement from './user-management';
import Docs from './docs/docs';
import RoomRoutes from 'app/entities/room';
import RoomImage from 'app/entities/room-image/room-image';
import Service from 'app/entities/service/service';
import Promotion from 'app/entities/promotion/promotion';
import Booking from 'app/entities/booking/booking';
import BookingDetails from 'app/entities/booking-details/booking-details';
import Report from 'app/entities/report/report';
import Notification from 'app/entities/notification/notification';
import RequestToBook from 'app/entities/request-to-book/requestToBook';
import BookingTracking from 'app/entities/booking-tracking/booking-tracking';

const AdministrationRoutes = () => (
  <div>
    <ErrorBoundaryRoutes>
      <Route path="user-management/*" element={<UserManagement />} />
      <Route path="docs" element={<Docs />} />
      <Route path="room/*" element={<RoomRoutes />} />
      <Route path="room-image/*" element={<RoomImage />} />
      <Route path="service/*" element={<Service />} />
      <Route path="promotion/*" element={<Promotion />} />
      <Route path="booking/*" element={<Booking />} />
      <Route path="booking-details/*" element={<BookingDetails />} />
      <Route path="report/*" element={<Report />} />
      <Route path="notification/*" element={<Notification />} />
      <Route path="request-to-book/:id" element={<RequestToBook />} /> {/* Add this line */}
      <Route path="booking-tracking/:id" element={<BookingTracking />} /> {/* Add this line */}
    </ErrorBoundaryRoutes>
  </div>
);

export default AdministrationRoutes;
