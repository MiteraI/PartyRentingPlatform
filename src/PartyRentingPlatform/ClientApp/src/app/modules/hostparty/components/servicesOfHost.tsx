import React, { useEffect } from 'react'
import { TabPanel } from './tabpanel'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { getServicesOfHost } from 'app/entities/service/service.reducer'
import ListTabPanelServiceOfCustomer from './list_tab_panel/listTabPanelServiceHost'

interface IServicesOfHost {
    valuePanel: number
}

const ServicesOfHost: React.FC<IServicesOfHost> = (props) => {
    const { valuePanel } = props
    const dispatch = useAppDispatch()
    const services = useAppSelector((state => state.service.entities));


    useEffect(() => {
        dispatch(getServicesOfHost({}))
    }, [])

    return (
        <TabPanel value={valuePanel} index={2}>
            <ListTabPanelServiceOfCustomer data={services} />
        </TabPanel>
    )
}

export default ServicesOfHost