import { Image } from "@mui/icons-material"
import { Dialog, DialogContent, DialogTitle } from "@mui/material"
import { Tag } from "antd"
import { IRoom } from "app/shared/model/room.model"
import React from "react"
import { Col, Row } from "reactstrap"

interface ICustomeItemDetai {
    label: string,
    value: string,
}


interface ICustomeDetail {
    title: string,
    data: IRoom,
    isOpen: boolean,
    handleOpen: () => void
}


const CustomeDetail: React.FC<ICustomeDetail> = (props) => {
    const { title, data, handleOpen, isOpen } = props
    const colStyle: React.CSSProperties = {
        textAlign: "center",
        marginBottom:"10px"
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
                            <img src="https://www.shutterstock.com/image-vector/zoo-map-enclosures-animals-outdoor-260nw-2148595493.jpg" alt="demo" />
                        </Row>
                    </Col>
                    <Col md={8}>
                        <Row md={12}>
                            <Col style={colStyle} md={6}>Room name: {data?.roomName}</Col>
                            <Col style={colStyle} md={6}>Address: {data?.address}</Col>
                            <Col style={colStyle} md={6}>Description: {data?.description}</Col>
                            <Col style={colStyle} md={6}>Price: {data?.price}</Col>
                            <Col style={colStyle} md={6}>Room capacity: {data?.roomCapacity}</Col>
                            <Col style={colStyle} md={6}>Rating : {data?.rating}</Col>
                            <Col style={colStyle} md={6}>Created by: {data?.user.login}</Col>
                            <Col style={colStyle} md={6}>Status: {data?.status}</Col>
                            <Col style={colStyle} md={6}>
                                Services:
                                {data?.services.map((service) => {
                                    return <Tag color="blue-inverse">{service.serviceName}</Tag>
                                })}
                            </Col>
                        </Row>

                    </Col>

                </Row>
            </DialogContent>
        </Dialog>
    )
}

export default CustomeDetail