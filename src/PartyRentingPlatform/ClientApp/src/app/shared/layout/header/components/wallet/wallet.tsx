import { Box } from "@mui/material";
import { Button, Drawer, Flex } from "antd"
import React from "react"

interface IWallet {
    open: boolean,
    handleClose: () => void;
}

const Wallet: React.FC<IWallet> = (props) => {
    const { open, handleClose } = props



    return (
        <Drawer title="Wallet" onClose={handleClose} open={open}>
            <Flex
                vertical
                gap="small"
                style={{ width: "100%" }}
            >
                <Box textAlign={"center"} >
                    Số dư
                </Box>
                <div style={{ textAlign: "center", marginBottom: "30px" }}>
                    <h1>3.222.333đ</h1>
                </div>

                <Button size="large" block>Nạp tiền</Button>
                <Button size="large" block>Rút tiền</Button>

            </Flex>
        </Drawer>
    )
}

export default Wallet