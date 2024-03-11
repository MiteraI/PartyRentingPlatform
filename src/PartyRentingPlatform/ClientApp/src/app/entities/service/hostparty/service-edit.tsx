import { useAppDispatch, useAppSelector } from "app/config/store";
import CustomeForm, { IFormItemDesign } from "app/shared/layout/formDesign/custome-form";
import { useParams } from "react-router"
import React, { useEffect } from "react"
import { IService } from "app/shared/model/service.model";
import { getServiceOfHost, reset, updateServiceOfHost } from "../service.reducer";
import { formatCurrency } from "app/shared/util/currency-utils";


const EditServiceOfHost = () => {
    const param = useParams();
    const { id } = param;
    const dispatch = useAppDispatch();
    const service = useAppSelector<IService>(state => state.service.entity);

    const handleSubmit = (values: IService) => {
        dispatch(updateServiceOfHost({ id, service: { ...service, ...values } }))
    }


    const listFormItem: IFormItemDesign[] = [
        {
            label: "Service name", name: "serviceName", type: "text", initialData: service?.serviceName,
            rules: [
                { required: true, message: "Please input your service name" }
            ]
        },
        {
            label: "Price", name: "price", type: "number", initialData: service?.price,
            min: 10000,
            max: 5000000,
            rules: [
                { required: true, message: `The price of service must be between ${formatCurrency(10000)} and ${formatCurrency(5000000)}` }
            ]
        },
        {
            label: "Description", name: "description", type: "text", initialData: service?.description, rules: [{
                required: true, message: "Please inpunt description"
            }]
        },
    ]


    useEffect(() => {
        dispatch(getServiceOfHost(id))
    }, [])

    return (
        <CustomeForm item={listFormItem} submit={handleSubmit} />
    )
}

export default EditServiceOfHost