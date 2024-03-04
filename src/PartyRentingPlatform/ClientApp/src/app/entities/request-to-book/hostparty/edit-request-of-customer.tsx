import React from "react";
import CustomeForm, { IFormItemDesign } from "app/shared/layout/formDesign/custome-form";
import { IBooking } from "app/shared/model/booking.model";


const EditRequestOfCustomer: React.FC = () => {


    const item: IFormItemDesign[] = [
        { label: "", name: "", type: "text" },
    ]

    const handleSubmit = (newValues: IBooking) => {

    }

    return (
        <CustomeForm item={item} submit={handleSubmit} />
    )
}


export default EditRequestOfCustomer