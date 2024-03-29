import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import { Form, Input, InputNumber } from "antd"
import { useAppDispatch } from "app/config/store"
import { IService } from "app/shared/model/service.model"
import React from "react"
import { createServiceOfHost } from "../service.reducer"
import { formatCurrency } from "app/shared/util/currency-utils"


interface IServiceModal {
    isOpen: boolean,
    handleIsOpen: () => void
}
const ServiceModal: React.FC<IServiceModal> = (props) => {
    const { isOpen, handleIsOpen } = props
    const dispatch = useAppDispatch()



    const handleFinish = (values: IService) => {
        dispatch(createServiceOfHost(values))
        handleIsOpen()
    }

    return (
        <Dialog
            open={isOpen ?? false}
            maxWidth="sm"
            fullWidth
            onClose={() => handleIsOpen()}
            scroll="paper"
        >
            <Form
                onFinish={handleFinish}
            >

                <DialogTitle id="scroll-dialog-title">Create service</DialogTitle>
                <DialogContent dividers>
                    <Form.Item
                        label="Service name"
                        name="serviceName"
                        rules={[
                            { required: true, message: "Please input service name " }
                        ]}
                    >

                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Price"
                        name="price"
                        rules={[
                            { required: true, message: `The price of service must be between ${formatCurrency(10000)} and ${formatCurrency(5000000)}` }
                        ]}
                    >

                        <InputNumber min={10000} max={5000000} />
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[
                            { required: true, message: "Please input description" }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <DialogActions>
                        <Button onClick={handleIsOpen}>Cancle</Button>
                        <Button type="submit">Create</Button>
                    </DialogActions>
                </DialogContent>
            </Form>
        </Dialog>
    )
}

export default ServiceModal