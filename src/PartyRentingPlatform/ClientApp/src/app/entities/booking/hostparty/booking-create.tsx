import { UploadOutlined } from "@mui/icons-material"
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, OutlinedInput } from "@mui/material"
import SelectInput, { SelectChangeEvent } from "@mui/material/Select/SelectInput"
import { Form, Input, InputNumber, Select, Upload } from "antd"
import { UploadChangeParam, UploadFile } from "antd/es/upload"
import { IBooking } from "app/shared/model/booking.model"
import React, { ChangeEventHandler, useState } from "react"
import { Theme, useTheme } from '@mui/material/styles';
import MultipleSelect from "./components/MultipleSelectInput"
import { IRoom } from "app/shared/model/room.model"
import { useAppDispatch } from "app/config/store"
import { createEntity, createEntityOfHost } from "app/entities/room/room.reducer"
import { formatCurrency } from "app/shared/util/currency-utils"


interface IBookingCreate {
    isOpen: boolean
    handleIsOpen: () => void
}


const BookingCreate: React.FC<IBookingCreate> = (props) => {
    const { isOpen, handleIsOpen } = props
    const [picture, setPicture] = useState([])
    const dispatch = useAppDispatch()
    const formData = new FormData()

    const handleUpLoadPicture = (info: any) => {
        const FileList = info.target.files
        // const listOfPicture = []
        // for (let index = 0; index < FileList.length; index++) {
        //     const element = FileList[index];
        //     listOfPicture.push(element)

        // }
        setPicture(FileList[0])
    }

    const handleFinish = (values: IRoom) => {
        const newValue = { ...values, formFiles: picture };
        dispatch(createEntityOfHost(newValue))
        handleIsOpen()

    }
    return (
        <Dialog
            fullWidth
            maxWidth="sm"
            open={isOpen}
            onClose={() => handleIsOpen()}
            scroll="paper"
        >
            <Form
                onFinish={handleFinish}
            >
                <DialogTitle id="scroll-dialog-title">Create room</DialogTitle>
                <DialogContent dividers>

                    <Form.Item
                        label="Room name"
                        name="roomName"
                        rules={[
                            { required: true, message: "Please input room name" }
                        ]}
                    >

                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Address"
                        name="address"
                        rules={[
                            { required: true, message: "Please input address" }
                        ]}
                    >

                        <Input />
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
                    <Form.Item
                        label="Price"
                        name="price"
                        rules={[
                            { required: true, message: `The price must be equal or more than ${formatCurrency(100000)}` }
                        ]}
                    >

                        <InputNumber min={100000} />
                    </Form.Item>
                    <Form.Item
                        label="Room capacity"
                        name="roomCapacity"
                        rules={[
                            { required: true, message: "The amount of people must be over than 5" }
                        ]}
                    >

                        <InputNumber min={5} />
                    </Form.Item>

                    <Form.Item
                        label="File picture"
                        name="formFiles"
                        rules={[
                            { required: true, message: "Please input file" }
                        ]}
                        initialValue={''}
                    >

                        <input type="file" onChange={handleUpLoadPicture} />
                    </Form.Item>

                    {/* <Form.Item
                        label="promotions"
                        name="promotions"
                        initialValue={[]}
                    >
                        <Select
                            mode="multiple"
                            style={{ position: "relative", zIndex: "10000" }}
                            options={[
                                { label: "1", value: 1 },
                                { label: "2", value: 2 },
                                { label: "4", value: 3 },
                                { label: "5", value: 4 },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item
                        label="services"
                        name="services"
                        initialValue={[]}
                    >
                        <Select
                            mode="multiple"
                            style={{ position: "relative", zIndex: "10000" }}
                            options={[
                                { label: "1", value: 1 },
                                { label: "2", value: 2 },
                                { label: "4", value: 3 },
                                { label: "5", value: 4 },
                            ]}
                        />
                    </Form.Item> */}
                </DialogContent>
                <DialogActions>
                    <Button type="submit">Create</Button>
                </DialogActions>
            </Form>

        </Dialog>
    )
}

export default BookingCreate