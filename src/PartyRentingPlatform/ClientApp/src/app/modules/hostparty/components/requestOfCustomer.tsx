import React, { useEffect, useState } from "react"
import { TabPanel } from "./tabpanel"
import { Avatar, Box, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText, Pagination } from "@mui/material"

import { useAppDispatch, useAppSelector } from "app/config/store";
import { filterRequestOfCustomerByStatus, getRequestOfCustomer } from "app/entities/booking/booking.reducer";
import { IBooking } from "app/shared/model/booking.model";
import ListTabPanelRequestOfCustomer from "./list_tab_panel/listTabPanelRequestOfCustomer";
import FilterRequestOfCustomer from "./filter/filterRequestOfCustomer";


interface IRequestOfCustomer {
    valuePanel: number
}


const RequestOfCustomer: React.FC<IRequestOfCustomer> = (props) => {
    const [status, setStatus] = useState<number>(1)
    const dispatch = useAppDispatch()
    const requestOfCustomer = useAppSelector((state) => state.booking.entities) as IBooking[]
    const [page, setPage] = useState<number>(0);
    const totalPagination = Math.ceil(useAppSelector(state => state.booking.totalItems) / 5);

    const handleEditFunction = (id: string | number) => {

    }

    const handleDeleteFunction = (id: string | number) => {

    }

    const handleStatus = (value: number) => {
        setStatus(value)
    }

    const handlePage = (event: React.ChangeEvent, page: number) => {
        setPage(page - 1);

    }


    useEffect(() => {
        if (status === 5) {
            dispatch(getRequestOfCustomer({ page: page, size: 5, sort: "id,asc" }))
        } else {
            dispatch(filterRequestOfCustomerByStatus({ query: status, page: page, size: 5, sort: "id,asc" }))
        }
    }, [status,page])


    return (
        <>
            <Box sx={{ bgcolor: 'background.paper' }}>
                <div style={{ width: "100%", textAlign: "end" }}>
                    <FilterRequestOfCustomer changeStatus={handleStatus} />
                </div>
            </Box>
            <ListTabPanelRequestOfCustomer status={status} editfunction={handleEditFunction} deletefunction={handleDeleteFunction} data={requestOfCustomer} />
            <Grid sx={{ marginTop: "10px", flexGrow: 1 }}>
                <Pagination onChange={handlePage} style={{ display: "flex", justifyContent: "right" }} count={totalPagination} variant="outlined" shape="rounded" />
            </Grid>
        </>
        // <TabPanel value={valuePanel} index={1}>
        // </TabPanel>

    )
}

export default RequestOfCustomer