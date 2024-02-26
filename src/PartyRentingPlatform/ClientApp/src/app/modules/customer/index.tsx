import ErrorBoundaryRoutes from "app/shared/error/error-boundary-routes"
import React from 'react'
import { Route } from "react-router-dom"
import RoomDetailForCustomer from "./room/room"
import PrivateRoute from "app/shared/auth/private-route"
import { AUTHORITIES } from "app/config/constants"
import RoomBookingForCustomer from "./room/room-booking"
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
                            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.USER]}>
                                <RoomBookingForCustomer />
                            </PrivateRoute>
                        } />
                    </Route>
                </Route>

            </Route>
        </ErrorBoundaryRoutes>
    </div>
)


export default CustomerRoutes