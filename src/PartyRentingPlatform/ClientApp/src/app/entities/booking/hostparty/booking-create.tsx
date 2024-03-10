import { UploadOutlined } from "@mui/icons-material"
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, OutlinedInput } from "@mui/material"
import SelectInput, { SelectChangeEvent } from "@mui/material/Select/SelectInput"
import { Form, Input, Select, Upload } from "antd"
import { UploadChangeParam, UploadFile } from "antd/es/upload"
import { IBooking } from "app/shared/model/booking.model"
import React, { ChangeEventHandler, useState } from "react"
import { Theme, useTheme } from '@mui/material/styles';
import MultipleSelect from "./components/MultipleSelectInput"
import { IRoom } from "app/shared/model/room.model"
import { useAppDispatch } from "app/config/store"
import { createEntity, createEntityOfHost } from "app/entities/room/room.reducer"


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
                        label="roomname"
                        name="roomName"
                        rules={[
                            { required: true, message: "Please input your username" }
                        ]}
                    >

                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="address"
                        name="address"
                        rules={[
                            { required: true, message: "Please input your username" }
                        ]}
                    >

                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="description"
                        name="description"
                        rules={[
                            { required: true, message: "Please input your username" }
                        ]}
                    >

                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="price"
                        name="price"
                        rules={[
                            { required: true, message: "Please input your username" }
                        ]}
                    >

                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="roomCapacity"
                        name="roomCapacity"
                        rules={[
                            { required: true, message: "Please input your username" }
                        ]}
                    >

                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="rating"
                        name="rating"
                        rules={[
                            { required: true, message: "Please input your username" },
                            { required: true, min: 0, max: 5, message: "The rating should be from 1-5" }
                        ]}
                    >

                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        label="status"
                        name="status"
                        rules={[
                            { required: true, message: "Please input your status" }
                        ]}
                    >

                        <Input type="number" />
                    </Form.Item>
                    {/* <Form.Item
                        label="formFiles"
                        name="formFiles"
                        rules={[
                            { required: true, message: "Please input your username" }
                        ]}
                        initialValue={''}
                    >

                        <input type="file" onChange={handleUpLoadPicture} />
                    </Form.Item> */}

                    <Form.Item
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
                    </Form.Item>
                </DialogContent>
                <DialogActions>
                    <Button>Cancle</Button>
                    <Button type="submit">Create</Button>
                </DialogActions>
            </Form>

        </Dialog>
    )
}

export default BookingCreate