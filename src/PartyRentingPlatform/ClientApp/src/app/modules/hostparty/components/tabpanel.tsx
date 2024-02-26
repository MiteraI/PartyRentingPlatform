import { Box, Grid } from "@mui/material";
import React from "react"

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

export const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

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
                        </Grid>
                    </Grid>
                </Box>
            )}
        </div>
    );
}