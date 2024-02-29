import { Box, Grid, Pagination } from "@mui/material";
import React from "react"

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

export const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;
    const gridStyle: React.CSSProperties = {
        height: "300px",
        maxHeight: "300px",
        overflowY: "hidden"
    }


    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            style={{ flexGrow: 1 }}
            {...other}
        >
            {value === index && (
                <Box>
                    <Grid container >
                        <Grid item sx={{ flexGrow: 1 }}>
                            {children}
                            <Pagination style={{ display: "flex", justifyContent: "right" }} count={10} variant="outlined" shape="rounded" />
                        </Grid>
                    </Grid>
                </Box>
            )}
        </div>
    );
}