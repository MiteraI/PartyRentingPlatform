import { useAppDispatch, useAppSelector } from "app/config/store";
import CustomeForm, { IFormItemDesign } from "app/shared/layout/formDesign/custome-form";
import { useParams } from "react-router"
import React, { useEffect } from "react"
import { IService } from "app/shared/model/service.model";
import { getServiceOfHost, reset, updateServiceOfHost } from "../service.reducer";


const EditServiceOfHost = () => {
    const param = useParams();
    const { id } = param;
    const dispatch = useAppDispatch();
    const service = useAppSelector<IService>(state => state.service.entity);

    const handleSubmit = (values: IService) => {
        dispatch(updateServiceOfHost({ id, service: { ...service, ...values } }))
    }


    const listFormItem: IFormItemDesign[] = [
        { label: "serviceName", name: "serviceName", type: "text", initialData: service?.serviceName },
        { label: "price", name: "price", type: "text", initialData: service?.price },
        { label: "description", name: "description", type: "text", initialData: service?.description },
    ]


    useEffect(() => {
        dispatch(getServiceOfHost(id))
    }, [])

    return (
        <CustomeForm item={listFormItem} submit={handleSubmit} />
    )
}

export default EditServiceOfHost