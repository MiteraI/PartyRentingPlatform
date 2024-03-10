import { Box } from "@mui/material";
import { Button, Card, Drawer, Flex, Form, Input, message } from "antd"
import { useAppDispatch, useAppSelector } from "app/config/store";
import { createDeposit } from "app/entities/wallet/wallet.reducer";
import { IHistoryTransactions } from "app/shared/model/wallet.model";
import { getBalance, getHistoryTransactions } from "app/shared/reducers/application-profile";
import { formatCurrency } from "app/shared/util/currency-utils";
import { convertDateTimeToVietName } from "app/shared/util/date-utils";
import React, { ChangeEventHandler, useEffect, useState } from "react"
import { Storage } from "react-jhipster";

interface IWallet {
    open: boolean,
    handleClose: () => void;
}


interface IDeposit {
    price: number,
    returnUrl: string
}

const Wallet: React.FC<IWallet> = (props) => {
    const { open, handleClose } = props
    const [price, setPrice] = useState<number>(0)
    const dispatch = useAppDispatch()
    const loading = useAppSelector(state => state.wallet.loading);
    const vnpay = useAppSelector(state => state.wallet.entity)
    const balance = useAppSelector(state => state.applicationProfile.balance) as number;
    const historyTransactions = useAppSelector(state => state.applicationProfile.entities) as IHistoryTransactions[];
    const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated)


    const handleFinish = (values: any) => {
        const returnUrl = "http://localhost:9000/"
        const value: IDeposit = {
            price: values?.price,
            returnUrl
        }
        dispatch(createDeposit(value))
    }

    useEffect(() => {
        if (vnpay != null) {
            window.open(vnpay, "_blank")
        }
    }, [vnpay])

    useEffect(() => {
        dispatch(getBalance())
        dispatch(getHistoryTransactions())
    }, [balance])


    return (
        <Drawer mask title="Wallet" onClose={handleClose} open={open}>
            <Flex
                vertical
                gap="small"
                style={{ width: "100%" }}
            >
                <Box textAlign={"center"} >
                    Số dư
                </Box>
                <div style={{ textAlign: "center", marginBottom: "30px" }}>
                    <h1>{formatCurrency(balance ?? balance)}</h1>
                </div>

                <Box>
                    <Form
                        onFinish={handleFinish}
                    >
                        <Box sx={{ display: "flex" }}>
                            <Form.Item
                                rules={[{
                                    required: true, message: "Please type in the money you want to deposit"
                                }]}
                                style={{ marginBottom: "0px", marginRight: "3px", flexGrow: 1 }}
                                name={"price"}
                            >
                                <Input style={{ padding: "8px" }} type="number" />
                            </Form.Item>
                            <Button loading={loading} htmlType="submit" size="large" >Nạp tiền</Button>
                        </Box>
                    </Form>

                </Box>
                <Button size="large" block>Rút tiền</Button>


                <Box sx={{ height: "48vh", marginTop: "30px", overflowY: "scroll" }}>
                    <h2>Lịch sử giao dịch</h2>
                    <Box sx={{ marginTop: "10px", padding: "5px" }}>
                        {historyTransactions?.map((history) => {
                            return (
                                <Box sx={{ marginBottom: "10px", boxShadow: "1px 1px 7px 1px #adadad", padding: "15px", borderRadius: "8px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <div>
                                            Transaction No: {history.transactionNo}
                                        </div>
                                        <div>
                                            Status: {history.status}
                                        </div>
                                    </div>
                                    <div>Create at: {convertDateTimeToVietName(history.createdAt)}</div>
                                    <div>Amount: +{formatCurrency(history.amount)}</div>
                                </Box>
                            )
                        })}
                    </Box>
                </Box>
            </Flex>
        </Drawer>
    )
}

export default Wallet