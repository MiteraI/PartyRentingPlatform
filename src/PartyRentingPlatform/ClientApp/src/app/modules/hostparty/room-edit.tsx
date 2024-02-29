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



    // form update
    const [promotion, setPromotion] = useState<number[]>([]);
    const [service, setService] = useState<number[]>([])


    useEffect(() => {
        dispatch(getEntities({}))
        dispatch(getServicesOfHost({}))
        dispatch(getEntityDetailsOfHost(id))
    }, [])

    const handelSubmit = (values: IRoom) => {
        const newValue = { ...room, ...values, formFiles: null, promotions: promotion, services: service } as IRoom;
        dispatch(updateEntityOfHost({ id, room: newValue }));
    }

    const handlePromotions = (newPromotion: number) => {
        setPromotion([newPromotion])
    }

    const handleServices = (newService: number) => {
        setService([newService])
    }



    const listFormItem: IFormItemDesign[] = [
        { label: "Room name", name: "roomname", type: "text", initialData: room?.roomName },
        { label: "Address", name: "address", type: "text", initialData: room?.address },
        { label: "Description", name: "description", type: "text", initialData: room?.description },
        { label: "Price", name: "price", type: "text", initialData: room?.price },
        { label: "Room Capacity", name: "roomCapacity", type: "text", initialData: room?.roomCapacity },
        { label: "Rating", name: "rating", type: "text", initialData: room?.rating },
        { label: "Status", name: "status", type: "text", initialData: room?.status },
        { label: "Promotions", name: "promotions", type: "text", element: "select", selectData: promotions, onChangeFormItem: handlePromotions },
        { label: "Services", name: "services", type: "text", element: "select", selectData: services, onChangeFormItem: handleServices },
    ]

    return (
        <div>
            <CustomeForm item={listFormItem} submit={handelSubmit} />
        </div>
        // room?.roomName ?
        //     <Row md={12}>
        //         <Form
        //             onFinish={handelSubmit}
        //         >
        //             <Row md={12}>
        //                 <Col md={6}>
        //                     <Form.Item

        //                         initialValue={room.roomName}
        //                         label="roomname"
        //                         name="roomName"
        //                         rules={[
        //                             { required: true, message: "Please input your username" }
        //                         ]}
        //                     >

        //                         <Input />
        //                     </Form.Item>
        //                 </Col>

        //                 <Col md={6}>
        //                     <Form.Item
        //                         initialValue={room.address}
        //                         label="address"
        //                         name="address"
        //                         rules={[
        //                             { required: true, message: "Please input your username" }
        //                         ]}
        //                     >

        //                         <Input />
        //                     </Form.Item>
        //                 </Col>
        //                 <Col md={6}>
        //                     <Form.Item
        //                         initialValue={room.description}
        //                         label="description"
        //                         name="description"
        //                         rules={[
        //                             { required: true, message: "Please input your username" }
        //                         ]}
        //                     >

        //                         <Input />
        //                     </Form.Item>
        //                 </Col>
        //                 <Col md={6}>
        //                     <Form.Item
        //                         initialValue={room.price}
        //                         label="price"
        //                         name="price"
        //                         rules={[
        //                             { required: true, message: "Please input your username" }
        //                         ]}
        //                     >

        //                         <Input />
        //                     </Form.Item>
        //                 </Col>
        //                 <Col md={6}>
        //                     <Form.Item
        //                         initialValue={room.roomCapacity}
        //                         label="roomCapacity"
        //                         name="roomCapacity"
        //                         rules={[
        //                             { required: true, message: "Please input your username" }
        //                         ]}
        //                     >

        //                         <Input />
        //                     </Form.Item>
        //                 </Col>
        //                 <Col md={6}>
        //                     <Form.Item
        //                         initialValue={room.rating}
        //                         label="rating"
        //                         name="rating"
        //                         rules={[
        //                             { required: true, message: "Please input your username" },

        //                         ]}
        //                     >

        //                         <Input type="number" />
        //                     </Form.Item>
        //                 </Col>
        //                 <Col md={6}>
        //                     <Form.Item
        //                         initialValue={room.status}
        //                         label="status"
        //                         name="status"
        //                         rules={[
        //                             { required: true, message: "Please input your status" }
        //                         ]}
        //                     >

        //                         <Input type="text" />
        //                     </Form.Item>
        //                 </Col>

        //                 <Col md={6}>
        //                     <Form.Item
        //                         label="promotions"
        //                         name="promotions"
        //                         initialValue={[]}
        //                     >
        //                         <Select
        //                             mode="multiple"
        //                             options={[
        //                                 { label: "1", value: 1 },
        //                                 { label: "2", value: 2 },
        //                                 { label: "4", value: 3 },
        //                                 { label: "5", value: 4 },
        //                             ]}
        //                         />
        //                     </Form.Item>
        //                 </Col>

        //                 <Col md={6}>
        //                     <Form.Item
        //                         label="services"
        //                         name="services"
        //                         initialValue={[]}
        //                     >
        //                         <Select
        //                             mode="multiple"
        //                             options={[
        //                                 { label: "1", value: 1 },
        //                                 { label: "2", value: 2 },
        //                                 { label: "4", value: 3 },
        //                                 { label: "5", value: 4 },
        //                             ]}
        //                         />
        //                     </Form.Item>

        //                 </Col>

        //                 <Col md={2}>
        //                     <Button htmlType="submit">Update</Button>
        //                 </Col>


        //             </Row>
        //         </Form>

        //     </Row>
        //     : <div></div>


    )
}

export default EditRoomOfHost