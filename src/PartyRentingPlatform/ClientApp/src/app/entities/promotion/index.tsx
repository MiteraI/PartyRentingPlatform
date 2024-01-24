import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Promotion from './promotion';
import PromotionDetail from './promotion-detail';
import PromotionUpdate from './promotion-update';
import PromotionDeleteDialog from './promotion-delete-dialog';

const PromotionRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Promotion />} />
    <Route path="new" element={<PromotionUpdate />} />
    <Route path=":id">
      <Route index element={<PromotionDetail />} />
      <Route path="edit" element={<PromotionUpdate />} />
      <Route path="delete" element={<PromotionDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default PromotionRoutes;
