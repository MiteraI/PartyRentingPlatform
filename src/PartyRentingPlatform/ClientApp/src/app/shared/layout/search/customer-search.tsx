import { Autocomplete, TextField } from "@mui/material"
import React, { CSSProperties, ChangeEvent, ChangeEventHandler } from "react"

const CustomeSearch: React.FC = () => {

    const handelFindRoomByName = (e: ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);
    }

    return (
        <Autocomplete

            sx={{

                color: "#ffffff",
                input: { color: 'white' },

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
                border: "none",
                "& input": {
                    width: "100%",
                    padding: "0px 14px",
                }
            }}
            options={[]}
            renderInput={(params) => (
                <TextField {...params}
                    label="Room"
                    onChange={handelFindRoomByName} />
            )}
        />
    )
}

export default CustomeSearch;