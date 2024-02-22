import ErrorBoundary from "app/shared/error/error-boundary"
import ErrorBoundaryRoutes from "app/shared/error/error-boundary-routes"
import React from 'react'
import { Route } from "react-router"

const HostPartyRoutes = () => (
    <div>
        <ErrorBoundaryRoutes>
            <Route path="request-customer" element={<></>} />
            <Route path="room" element={<></>} />
        </ErrorBoundaryRoutes>
    </div>
)


export default HostPartyRoutes