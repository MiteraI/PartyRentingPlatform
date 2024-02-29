import React, { useEffect, useState } from "react"
import { TabPanel } from "./tabpanel"
import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material"

import { useAppDispatch, useAppSelector } from "app/config/store";
import { getRequestOfCustomer } from "app/entities/booking/booking.reducer";
import { IBooking } from "app/shared/model/booking.model";
import ListTabPanelRequestOfCustomer from "./list_tab_panel/listTabPanelRequestOfCustomer";


interface IRequestOfCustomer {
    valuePanel: number
}


const RequestOfCustomer: React.FC<IRequestOfCustomer> = (props) => {
    const { valuePanel } = props
    const dispatch = useAppDispatch()
    const requestOfCustomer = useAppSelector((state) => state.booking.entities) as IBooking[]

    useEffect(() => {
        dispatch(getRequestOfCustomer({ page: 0, size: 100, sort: "id,asc" }))
    }, [])


    return (
        <TabPanel value={valuePanel} index={1}>
            <ListTabPanelRequestOfCustomer data={requestOfCustomer} />
        </TabPanel>

    )
}

export default RequestOfCustomer