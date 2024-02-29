import React, { useEffect, useState } from "react"
import { TabPanel } from "./tabpanel"
import { Avatar, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText, Pagination } from "@mui/material"

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
        dispatch(getRequestOfCustomer({ page: 0, size: 5, sort: "id,asc" }))
    }, [])


    return (
        <>
            <ListTabPanelRequestOfCustomer data={requestOfCustomer} />
            <Grid sx={{ marginTop: "10px", flexGrow: 1 }}>
                <Pagination style={{ display: "flex", justifyContent: "right" }} count={10} variant="outlined" shape="rounded" />
            </Grid>
        </>
        // <TabPanel value={valuePanel} index={1}>
        // </TabPanel>

    )
}

export default RequestOfCustomer