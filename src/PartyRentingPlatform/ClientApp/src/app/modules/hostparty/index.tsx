import TabsForHost from "app/entities/room/components/TabsForHost"
import ErrorBoundary from "app/shared/error/error-boundary"
import ErrorBoundaryRoutes from "app/shared/error/error-boundary-routes"
import React from 'react'
import { Route } from "react-router-dom"

const HostPartyRoutes = () => (
    <div>
        <ErrorBoundaryRoutes>
            <Route index element={<TabsForHost />} />
            {/* <Route path="request-customer" element={<TabsForHost />} />
            <Route path="room" element={<TabsForHost />} /> */}
        </ErrorBoundaryRoutes>
    </div>
)


export default HostPartyRoutes