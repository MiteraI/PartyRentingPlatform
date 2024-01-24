import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Booking from './booking';
import BookingDetail from './booking-detail';
import BookingUpdate from './booking-update';
import BookingDeleteDialog from './booking-delete-dialog';

const BookingRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Booking />} />
    <Route path="new" element={<BookingUpdate />} />
    <Route path=":id">
      <Route index element={<BookingDetail />} />
      <Route path="edit" element={<BookingUpdate />} />
      <Route path="delete" element={<BookingDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default BookingRoutes;
