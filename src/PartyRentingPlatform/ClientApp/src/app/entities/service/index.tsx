import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Service from './service';
import ServiceDetail from './service-detail';
import ServiceUpdate from './service-update';
import ServiceDeleteDialog from './service-delete-dialog';

const ServiceRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Service />} />
    <Route path="new" element={<ServiceUpdate />} />
    <Route path=":id">
      <Route index element={<ServiceDetail />} />
      <Route path="edit" element={<ServiceUpdate />} />
      <Route path="delete" element={<ServiceDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default ServiceRoutes;
