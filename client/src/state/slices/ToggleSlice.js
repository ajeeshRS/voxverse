import { createSlice } from "@reduxjs/toolkit"

const initialState= {
    value:false
}

const toggleSlice = createSlice({
    name:"toggleSlice",
    initialState,
    reducers:{
        toggle:(state)=>{
            state.value = !state.value
    }}
})

export const {toggle} = toggleSlice.actions
export default toggleSlice.reducer