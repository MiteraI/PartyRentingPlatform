import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import RoomImage from './room-image';
import RoomImageDetail from './room-image-detail';
import RoomImageUpdate from './room-image-update';
import RoomImageDeleteDialog from './room-image-delete-dialog';

const RoomImageRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<RoomImage />} />
    <Route path="new" element={<RoomImageUpdate />} />
    <Route path=":id">
      <Route index element={<RoomImageDetail />} />
      <Route path="edit" element={<RoomImageUpdate />} />
      <Route path="delete" element={<RoomImageDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default RoomImageRoutes;
