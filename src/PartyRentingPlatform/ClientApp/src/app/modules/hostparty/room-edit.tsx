import { Button, Form, Input, Select } from "antd";
import { useAppDispatch, useAppSelector } from "app/config/store";
import { getEntityDetailsOfHost, reset, updateEntityOfHost } from "app/entities/room/room.reducer";
import CustomeForm, { IFormItemDesign } from "app/shared/layout/formDesign/custome-form";
import { IRoom } from "app/shared/model/room.model";
import React, { ChangeEvent, ChangeEventHandler, useEffect, useState } from "react"
import { useLocation, useParams } from "react-router"
import { Col, Row } from "reactstrap";
import { getEntities } from 'app/entities/promotion/promotion.reducer';
import { getServicesOfHost } from "app/entities/service/service.reducer";
import { IService } from "app/shared/model/service.model";
import { IPromotion } from "app/shared/model/promotion.model";

const EditRoomOfHost = () => {
    const param = useParams();
    const { id } = param
    const dispatch = useAppDispatch()
    const room = useAppSelector<IRoom>((state => state.room.entityDetailsOfHost));
    const services = useAppSelector<IService[]>(state => state.service.entities);
    const promotions = useAppSelector<IPromotion[]>(state => state.promotion.entities);
    const status = useAppSelector<string>(state => state.room.entityDetailsOfHost?.status);


    // form update
    const [promotion, setPromotion] = useState<{ id: number }[]>([]);
    const [service, setService] = useState<{ id: number }[]>([])

    const updateStatus = (): number => {
        switch (status) {
            case "BLOCKED": {
                return 0
            }
            case "VALID": {
                return 1
            }
            case "APPROVING": {
                return 2
            }
            case "DELETED": {
                return 3
            }
            case "REJECTED": {
                return 4
            }

        }
    }



    useEffect(() => {
        dispatch(getEntities({}))
        dispatch(getServicesOfHost({}))
        dispatch(getEntityDetailsOfHost(id))

    }, [])

    const handelSubmit = (values: IRoom) => {
        const newValue = { ...room, ...values, services:room.services } as IRoom;
        const newValueWithServices = { ...room, ...values, services: service } as IRoom;
        dispatch(updateEntityOfHost({ id, room: service.length === 0 ? newValue : newValueWithServices }));
    }

    const handlePromotions = (newPromotion: number[]) => {
        const addPromotion = newPromotion.map((promotion) => { return { id: promotion } });
        setPromotion(addPromotion)
    }

    const handleServices = (newService: number[]) => {
        const addService = newService.map((service) => { return { id: service } });
        setService(addService)
    }


    const handleDefaultValueServices = () => {
        return room?.services.map((service) => service.id)

    }


    const selectStatusForm = [
        { id: 0, name: "BLOCKED" },
        { id: 1, name: "VALID" },
        { id: 2, name: "APPROVING" },
        { id: 3, name: "DELETED" },
        { id: 4, name: "REJECTED" },
    ]

    const listFormItem: IFormItemDesign[] = [
        { label: "Room name", name: "roomName", type: "text", initialData: room?.roomName },
        { label: "Address", name: "address", type: "text", initialData: room?.address },
        { label: "Description", name: "description", type: "text", initialData: room?.description },
        { label: "Price", name: "price", type: "text", initialData: room?.price },
        { label: "Room Capacity", name: "roomCapacity", type: "text", initialData: room?.roomCapacity },
        // { label: "Rating", name: "rating", type: "text", initialData: room?.rating },
        { label: "Status", name: "status", type: "text", alone: true, element: "select", initialData: updateStatus(), selectData: selectStatusForm },
        { label: "Promotions", name: "promotions", type: "text", element: "select", selectData: [], onChangeFormItem: handlePromotions },
        { label: "Services", name: "services", type: "text", element: "select", selectData: services, initialData: handleDefaultValueServices(), onChangeFormItem: handleServices },
    ]

    return (
        <CustomeForm item={listFormItem} submit={handelSubmit} />
    )
}

export default EditRoomOfHost