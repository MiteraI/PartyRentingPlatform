import { MenuItem, Select, SelectChangeEvent } from "@mui/material"
import React from "react"
interface IFilterRequestOfCustomer {
    changeStatus: (value: number) => void
}


const FilterRequestOfCustomer: React.FC<IFilterRequestOfCustomer> = (props) => {
    const { changeStatus } = props

    return (
        <Select
            size="small"
            defaultValue={"5"}
            labelId="demo-select-small-label"
            label="Filter"
            id="demo-select-small"
            onChange={(e: SelectChangeEvent) => changeStatus(Number(e.target.value))}
        >
            <MenuItem value={0}>Accepted</MenuItem>
            <MenuItem value={1}>Approving</MenuItem>
            <MenuItem value={2}>Rejected</MenuItem>
            <MenuItem value={3}>Deleted</MenuItem>
            <MenuItem value={4}>Valid</MenuItem>
            <MenuItem value={5}>All</MenuItem>
        </Select>
    )
}

export default FilterRequestOfCustomer