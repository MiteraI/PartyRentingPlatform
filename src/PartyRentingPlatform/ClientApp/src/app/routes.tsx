import React from 'react';
import { Route } from 'react-router-dom';
import Loadable from 'react-loadable';

import Login from 'app/modules/login/login';
import Register from 'app/modules/account/register/register';
import Activate from 'app/modules/account/activate/activate';
import PasswordResetInit from 'app/modules/account/password-reset/init/password-reset-init';
import PasswordResetFinish from 'app/modules/account/password-reset/finish/password-reset-finish';
import Logout from 'app/modules/login/logout';
import Home from 'app/modules/home/home';
import EntitiesRoutes from 'app/entities/routes';
import PrivateRoute from 'app/shared/auth/private-route';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import PageNotFound from 'app/shared/error/page-not-found';
import { AUTHORITIES } from 'app/config/constants';
import Room from './modules/room/room';
import TabsForHost from './entities/room/components/TabsForHost';
import CustomerRoutes from './modules/customer';
import EditRoomOfHost from './modules/hostparty/room-edit';


const loading = <div>loading ...</div>;

const Account = Loadable({
  loader: () => import(/* webpackChunkName: "account" */ 'app/modules/account'),
  loading: () => loading,
});

const Admin = Loadable({
  loader: () => import(/* webpackChunkName: "administration" */ 'app/modules/administration'),
  loading: () => loading,
});


const HostParty = Loadable({
  loader: () => import( /* webpackChunkName: "hostparty" */ 'app/modules/hostparty'),
  loading: () => loading
})
const AppRoutes = () => {
  return (
    <div className="view-routes">
      <ErrorBoundaryRoutes>
        <Route index element={

          <Home />

        } />
        <Route path="login" element={<Login />} />
        <Route path="logout" element={<Logout />} />

        // account route
        <Route path="account">
          <Route
            path="*"
            element={
              <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.USER]}>
                <Account />
              </PrivateRoute>
            }
          />
          <Route path="register" element={<Register />} />
          <Route path="activate" element={<Activate />} />
          <Route path="reset">
            <Route path="request" element={<PasswordResetInit />} />
            <Route path="finish" element={<PasswordResetFinish />} />
          </Route>
        </Route>

        // host party route
        <Route
          path='hostparty'
        >
          <Route
            index
            path="*"
            element={
              <PrivateRoute hasAnyAuthorities={[AUTHORITIES.HOST]}>
                <HostParty />
              </PrivateRoute>
            }
          />
          <Route path='room/edit'>
            <Route path=':id'>
              <Route index element={
                <PrivateRoute hasAnyAuthorities={[AUTHORITIES.HOST]}>
                  <EditRoomOfHost />
                </PrivateRoute>
              }
              />
            </Route>
          </Route>

        </Route>

        // admin route
        <Route
          path="admin/*"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN]}>
              {/* <EntitiesRoutes /> */}
              <Admin />
            </PrivateRoute>
          }
        />


        <Route
          path="*"
          element={
            <CustomerRoutes />
          }
        />

        <Route path="*" element={<PageNotFound />} />
      </ErrorBoundaryRoutes>
    </div>
  );
};

export default AppRoutes;
