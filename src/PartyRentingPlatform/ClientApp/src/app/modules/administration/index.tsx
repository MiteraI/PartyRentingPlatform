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
import BookingTracking from 'app/entities/booking-tracking/booking-tracking';
import PromotionRoutes from 'app/entities/promotion';
import ServiceRoutes from 'app/entities/service';
import BookingRoutes from 'app/entities/booking';
import BookingDetailsRoutes from 'app/entities/booking-details';
import ReportRoutes from 'app/entities/report';
import NotificationRoutes from 'app/entities/notification';
import RequestToBook from 'app/entities/request-to-book/requestToBook';

const AdministrationRoutes = () => (
  <div>
    <ErrorBoundaryRoutes>
      <Route path="user-management/*" element={<UserManagement />} />
      <Route path="docs" element={<Docs />} />
      <Route path="room/*" element={<RoomRoutes />} />
      <Route path="room-image/*" element={<RoomImage />} />
      <Route path="service/*" element={<ServiceRoutes />} />
      <Route path="promotion/*" element={<PromotionRoutes />} />
      <Route path="booking/*" element={<BookingRoutes />} />
      <Route path="booking-details/*" element={<BookingDetailsRoutes />} />
      <Route path="report/*" element={<ReportRoutes />} />
      <Route path="notification/*" element={<NotificationRoutes />} />
      <Route path="request-to-book/:id" element={<RequestToBook />} /> {/* Add this line */}
      <Route path="booking-tracking/:id" element={<BookingTracking />} /> {/* Add this line */}
    </ErrorBoundaryRoutes>
  </div>
);

export default AdministrationRoutes;
