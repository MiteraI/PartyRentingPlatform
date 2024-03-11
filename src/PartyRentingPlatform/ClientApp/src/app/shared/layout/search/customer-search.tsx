import { Autocomplete, Box, TextField } from "@mui/material"
import { AutoComplete, Input, Select } from "antd"
import { useAppDispatch, useAppSelector } from "app/config/store"
import { getEntitiesForCustomer } from "app/entities/booking/booking.reducer"
import { searchEntitiesForAll } from "app/entities/room/room.reducer"
import { IRoom } from "app/shared/model/room.model"
import { generateStarIcons } from "app/shared/util/icon-utils"
import React, { CSSProperties, ChangeEvent, ChangeEventHandler, KeyboardEvent, KeyboardEventHandler, useEffect, useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"

const CustomeSearch: React.FC = () => {

    const dispatch = useAppDispatch()
    const searchEntities = useAppSelector(state => state.room.searchEntities) as IRoom[]
    const loading = useAppSelector(state => state.room.loading) as boolean
    const navigate = useNavigate()

    const handleOnSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if (value == "" || value == null) {

        } else {
            dispatch(searchEntitiesForAll({ roomName: value, page: 0, size: 5, sort: "id,asc" }))
        }
    }

    const handleOnClick = (id: number) => {
        navigate(`/room/detail/${id}`)

    }
    return (
        <AutoComplete
            popupClassName="certain-category-search-dropdown"
            popupMatchSelectWidth
            style={{ width: "100%" }}
            options={searchEntities?.map((room) => {
                return {
                    label:
                        <div onClick={() => handleOnClick(room.id)} style={{ display: "flex", justifyContent: "space-between" }}>
                            <div>
                                <h6>
                                    {room.roomName}
                                </h6>
                                <p>
                                    Description: {room.description}
                                </p>
                            </div>
                            <div>{generateStarIcons(room.rating)}</div>
                        </div>,
                    value: `${room.roomName}`
                }
            })}
            size="large"
        // onChange={handleToPageDetail}
        >
            <Input.Search loading={loading} onChange={handleOnSearch} size="large" placeholder="Find room here" />
        </AutoComplete>
    )
}

export default CustomeSearch;