import React, { useEffect, useState } from 'react'
import { TabPanel } from './tabpanel'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { deleteServiceOfHost, getServicesOfHost, reset } from 'app/entities/service/service.reducer'
import ListTabPanelServiceOfCustomer from './list_tab_panel/listTabPanelServiceHost'
import { Box, Button, Grid, Pagination } from '@mui/material'
import ServiceModal from 'app/entities/service/modal/service-create'
import { useNavigate } from 'react-router'

interface IServicesOfHost {
    valuePanel: number
}

const ServicesOfHost: React.FC<IServicesOfHost> = (props) => {
    const { valuePanel } = props
    const dispatch = useAppDispatch()
    const services = useAppSelector((state => state.service.entities));
    const [open, setOpen] = useState<boolean>(false)
    const navigate = useNavigate()



    useEffect(() => {
        dispatch(reset())
        dispatch(getServicesOfHost({ page: 0, size: 5, sort: "id,asc" }))
    }, [])


    const handleIsOpen = () => {
        setOpen(!open)
    }

    const handelEdit = (id: string | number) => {
        navigate(`edit/${id}`)
    }

    const handleDeleteService = (id: string | number) => {
        dispatch(deleteServiceOfHost(id));
    }


    return (

        <>
            <ServiceModal handleIsOpen={handleIsOpen} isOpen={open} />
            {/* <TabPanel value={valuePanel} index={2}> */}
            <Box sx={{ bgcolor: "background.paper" }}>
                <div style={{ width: "100%", textAlign: "end" }}>
                    <Button variant='contained' onClick={handleIsOpen}>
                        Create new service
                    </Button>
                </div>

            </Box>
            <ListTabPanelServiceOfCustomer editfunction={handelEdit} deletefunction={handleDeleteService} data={services} />
            <Grid sx={{ marginTop: "10px", flexGrow: 1 }}>
                <Pagination style={{ display: "flex", justifyContent: "right" }} count={10} variant="outlined" shape="rounded" />
            </Grid>
            {/* </TabPanel> */}
        </>
    )
}

export default ServicesOfHost