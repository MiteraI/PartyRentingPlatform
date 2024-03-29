import { Rule } from "antd/es/form"
import React, { ChangeEventHandler, useEffect, useState } from "react"
import { Button, Form, Input, InputNumber, Select } from "antd"
import { Col, Row } from "reactstrap"
import { useAppDispatch } from "app/config/store"
import { reset } from "app/entities/room/room.reducer"


type InputType = "text" | "number" | "file" | "date" | "email" | "datetime-local"
type ElementType = "select" | "input"


export interface IFormItemDesign {
    label: string,
    name: string,
    initialData?: any,
    rules?: Rule[],
    onChangeFormItem?: (e: any) => void,
    type: InputType,
    element?: ElementType
    selectData?: any[],
    alone?: true,
    min?: number,
    max?: number
}


interface IFormDesign {
    item: IFormItemDesign[],
    submit: (callback) => void
}




const CustomeForm: React.FC<IFormDesign> = (props) => {
    const { item, submit } = props
    const { Option } = Select
    const formStyle: React.CSSProperties = {
        margin: "0px 20px",
        border: "0.5px solid black",
        boxShadow: "#b5b5b5 5px 7px 20px 4px",
    }

    const FormItemRender: React.FC = () => (
        <Row xl={12} style={{ padding: "50px 20px" }}>
            {item.map((formItem) => {
                return (
                    <Col xl={6}>
                        <Form.Item
                            label={formItem.label}
                            name={formItem.name}
                            initialValue={formItem.initialData}
                            rules={formItem.rules}
                        >

                            {
                                formItem.element === "select" ?
                                    <Select
                                        mode={formItem.alone ? undefined : "multiple"}
                                        onChange={formItem.onChangeFormItem ? (value) => formItem.onChangeFormItem(value) : undefined}
                                    >
                                        {formItem.selectData.map((object) => <Option value={object.id}>{object.serviceName || object.name}</Option>)}
                                    </Select>
                                    :
                                    formItem.type === "number"
                                        ?
                                        <InputNumber min={formItem.min} max={formItem.max} type="number" onChange={formItem.onChangeFormItem} />
                                        :
                                        <Input type={formItem.type} onChange={formItem.onChangeFormItem} />
                            }
                        </Form.Item>
                    </Col>
                )
            })}

            <Col md={12}>
                <Row md={12} style={{ textAlign: "center" }}>
                    <Button size="large" htmlType="submit">Submit</Button>
                </Row>
            </Col>

        </Row>
    )

    return (
        <Form
            style={formStyle}
            onFinish={submit}
        >
            <FormItemRender />
        </Form>
    )
}


export default CustomeForm