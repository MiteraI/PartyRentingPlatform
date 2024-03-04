import ErrorBoundaryRoutes from "app/shared/error/error-boundary-routes"
import React from 'react'
import { Route } from "react-router-dom"
import RoomDetailForCustomer from "./room/room"
import PrivateRoute from "app/shared/auth/private-route"
import { AUTHORITIES } from "app/config/constants"
import RoomBookingForCustomer from "./room/room-booking"
import BookingTracking from "./room/booking-tracking"
import UserPage from "./booking/booking-list"
const CustomerRoutes = () => (
    <div>
        <ErrorBoundaryRoutes>
            <Route path="room/*">
                <Route path="detail"  >
                    <Route path=":id">
                        <Route index element={<RoomDetailForCustomer />} />
                    </Route>
                </Route>

                <Route path="request-to-book">
                    <Route path=":id">
                        <Route index element={
                            // <PrivateRoute hasAnyAuthorities={[AUTHORITIES.USER]}>
                                <RoomBookingForCustomer />
                            // </PrivateRoute>
                        } />
                    </Route>
                </Route>
                <Route path="booking-tracking">
                    <Route path=":id">
                        <Route index element={
                            // <PrivateRoute hasAnyAuthorities={[AUTHORITIES.USER]}>
                                <BookingTracking />
                            // </PrivateRoute>
                        } />
                    </Route>
                </Route>
                <Route path="booking-list">
                        <Route index element={
                            // <PrivateRoute hasAnyAuthorities={[AUTHORITIES.USER]}>
                                <UserPage />
                            // </PrivateRoute>
                        } />
                </Route>

            </Route>
        </ErrorBoundaryRoutes>
    </div>
)


export default CustomerRoutes