import { Image } from "@mui/icons-material"
import { Dialog, DialogContent, DialogTitle } from "@mui/material"
import { Tag } from "antd"
import { IBooking } from "app/shared/model/booking.model"
import { IRoom } from "app/shared/model/room.model"
import { formatCurrency } from "app/shared/util/currency-utils"
import dayjs from "dayjs"
import React from "react"
import { Col, Row } from "reactstrap"

interface ICustomeItemDetai {
    label: string,
    value: string,
}


interface ICustomeDetail {
    title: string,
    data: IBooking,
    isOpen: boolean,
    handleOpen: () => void
}


const CustomeDetailRequestCustomer: React.FC<ICustomeDetail> = (props) => {
    const { title, data, handleOpen, isOpen } = props
    const colStyle: React.CSSProperties = {
        textAlign: "center",
        marginBottom: "10px"
    }

    return (
        <Dialog
            fullWidth
            maxWidth={"md"}
            open={isOpen}
            onClose={handleOpen}
            scroll="paper"
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Row md={12}>
                    <Col md={4}>
                        <Row md={12}>
                            <img height={"200px"} src={"https://storage.googleapis.com/digital-platform/chiem_nguong_20_mau_biet_thu_dep_sang_trong_bac_nhat_so_2_18ef110d5e/chiem_nguong_20_mau_biet_thu_dep_sang_trong_bac_nhat_so_2_18ef110d5e.jpg"} alt="demo" />
                        </Row>
                    </Col>
                    <Col md={8}>
                        <Row md={12}>
                            <Col style={colStyle} md={6}>Room name: {data?.room?.roomName}</Col>
                            <Col style={colStyle} md={6}>Customer name: {data?.customerName}</Col>
                            <Col style={colStyle} md={6}>Total price: {formatCurrency(data?.totalPrice)}</Col>
                            <Col style={colStyle} md={6}>Status: {data?.status}</Col>
                            <Col style={colStyle} md={6}>Start time: {dayjs(data?.startTime).locale("vi").format("DD/MM/YYYY")}</Col>
                            <Col style={colStyle} md={6}>End time : {dayjs(data?.endTime).locale("vi").format("DD/MM/YYYY")}</Col>
                            <Col style={colStyle} md={6}>Services use : {data?.bookingDetails?.map((service) => {
                                return (
                                    <Tag color="blue-inverse">{service.service.serviceName}</Tag>
                                )
                            })}</Col>

                        </Row>

                    </Col>

                </Row>
            </DialogContent>
        </Dialog>
    )
}

export default CustomeDetailRequestCustomer