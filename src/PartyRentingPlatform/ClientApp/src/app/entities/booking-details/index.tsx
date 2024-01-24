import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import BookingDetails from './booking-details';
import BookingDetailsDetail from './booking-details-detail';
import BookingDetailsUpdate from './booking-details-update';
import BookingDetailsDeleteDialog from './booking-details-delete-dialog';

const BookingDetailsRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<BookingDetails />} />
    <Route path="new" element={<BookingDetailsUpdate />} />
    <Route path=":id">
      <Route index element={<BookingDetailsDetail />} />
      <Route path="edit" element={<BookingDetailsUpdate />} />
      <Route path="delete" element={<BookingDetailsDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default BookingDetailsRoutes;
