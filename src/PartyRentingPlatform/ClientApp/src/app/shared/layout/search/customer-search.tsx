import { Autocomplete, Box, TextField } from "@mui/material"
import { useAppDispatch, useAppSelector } from "app/config/store"
import { getEntitiesForCustomer } from "app/entities/booking/booking.reducer"
import { searchEntitiesForAll } from "app/entities/room/room.reducer"
import { IRoom } from "app/shared/model/room.model"
import React, { CSSProperties, ChangeEvent, ChangeEventHandler, useEffect, useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"

const CustomeSearch: React.FC = () => {

    const dispatch = useAppDispatch()
    const searchEntities = useAppSelector(state => state.room.searchEntities) as IRoom[]
    const searchEntitiesDefaultValue = useAppSelector(state => state.booking.searchEntities) as IRoom[]
    const loading = useAppSelector(state => state.room.loading) as boolean
    const navigate = useNavigate()

    const handelFindRoomByName = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value == "" || e.target.value == null) {

        } else {
            dispatch(searchEntitiesForAll({ roomName: e.target.value, page: 0, size: 5, sort: "id,asc" }))
        }
    }

    const handleToPageDetail = (id: number) => {
        navigate(`/room/detail/${id}`)
    }


    return (
        <Autocomplete
            sx={{

                color: "#ffffff",
                input: { color: 'black' },

                "& .MuiInputLabel-root": { color: '#5D5CDE', borderColor: "#5D5CDE" },//styles the label
                "& .MuiInputLabel-root:hover": { color: '#5D5CDE', borderColor: "#5D5CDE" },
                "& .MuiOutlinedInput-root": {
                    "& > fieldset": { color: '#5D5CDE', borderColor: "#5D5CDE", borderRadius: '10px' },
                    '&:hover $notchedOutline': {
                        borderColor: '#5D5CDE',
                        color: '#5D5CDE'
                    },
                },
                "& .MuiOutlinedInput-root:hover": {
                    "& > fieldset": { color: '#5D5CDE', borderColor: "#5D5CDE" },
                    '&:hover $notchedOutline': {
                        borderColor: '#5D5CDE',
                        color: '#5D5CDE'
                    },
                },
                "& .MuiOutlinedInput-root.Mui-focused": {
                    "& > fieldset": { color: '#5D5CDE', borderColor: "#5D5CDE" },
                    '&:hover $notchedOutline': {
                        borderColor: '#5D5CDE',
                        color: '#5D5CDE'
                    },
                },
                "& .MuiInputLabel-root.Mui-focused": { color: '#5D5CDE', borderColor: "#5D5CDE" },
                // 
                width: "100%",
                marginLeft: "10px",
                marginRight: "10px",
                border: "none",
                "& input": {
                    width: "100%",
                    padding: "0px 14px",
                }
            }}

            clearOnEscape
            includeInputInList
            options={searchEntities ? searchEntities : []}
            loading={loading}
            getOptionLabel={(option) => option.roomName}
            renderOption={(props, option) => searchEntities ? (
                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    <Box onClick={() => handleToPageDetail(option.id)}>
                        <img
                            loading="lazy"
                            width="20"
                            srcSet={`https://flagcdn.com/w40/vn.png 2x`}
                            src={`https://flagcdn.com/w20/vn.png`}
                            style={{ marginRight: "2px" }}
                            alt="image"
                        />
                        {option.roomName} ({option.address}) + {option.description}
                    </Box>
                </Box>
            ) : <div></div>}
            renderInput={(params) => (
                <TextField
                    {...params}
                    inputProps={{
                        ...params.inputProps
                    }}
                    label="Room"
                    onChange={handelFindRoomByName} />
            )}

        />
    )
}

export default CustomeSearch;