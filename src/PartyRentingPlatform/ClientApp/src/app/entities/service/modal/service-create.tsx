import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import { Form, Input } from "antd"
import { useAppDispatch } from "app/config/store"
import { IService } from "app/shared/model/service.model"
import React from "react"
import { createServiceOfHost } from "../service.reducer"


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
                        label="serviceName"
                        name="serviceName"
                        rules={[
                            { required: true, message: "Please input " }
                        ]}
                    >

                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="price"
                        name="price"
                        rules={[
                            { required: true, message: "Please input " }
                        ]}
                    >

                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="description"
                        name="description"
                        rules={[
                            { required: true, message: "Please input " }
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