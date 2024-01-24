import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Room from './room';
import RoomDetail from './room-detail';
import RoomUpdate from './room-update';
import RoomDeleteDialog from './room-delete-dialog';

const RoomRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Room />} />
    <Route path="new" element={<RoomUpdate />} />
    <Route path=":id">
      <Route index element={<RoomDetail />} />
      <Route path="edit" element={<RoomUpdate />} />
      <Route path="delete" element={<RoomDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default RoomRoutes;
