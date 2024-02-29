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
        height: "auto",
        maxHeight: "514px",
        overflowY: "hidden",
        flexGrow: 1
    }
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            style={{ flexGrow: 1, width: "100%" }}
            {...other}
        >
            {value === index && (
                <Box>
                    <Grid>
                        <Grid sx={gridStyle}>

                            {children}

                        </Grid>
                        
                    </Grid>
                </Box>
            )}
        </div>
    );
}