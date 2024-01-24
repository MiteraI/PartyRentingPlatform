import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Report from './report';
import ReportDetail from './report-detail';
import ReportUpdate from './report-update';
import ReportDeleteDialog from './report-delete-dialog';

const ReportRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Report />} />
    <Route path="new" element={<ReportUpdate />} />
    <Route path=":id">
      <Route index element={<ReportDetail />} />
      <Route path="edit" element={<ReportUpdate />} />
      <Route path="delete" element={<ReportDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default ReportRoutes;
