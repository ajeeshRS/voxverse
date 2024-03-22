import { createSlice } from "@reduxjs/toolkit"

const initialState= {
    value:false
}

const otpSlice = createSlice({
    name:"otpSlice",
    initialState,
    reducers:{
        toggle:(state)=>{
            state.value = true
    }}
})

export const {toggle} = otpSlice.actions
export default otpSlice.reducer