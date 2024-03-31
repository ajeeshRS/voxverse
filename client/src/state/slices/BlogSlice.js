import { createSlice } from "@reduxjs/toolkit"

const initialState= {
    blogs:[]
}

const blogSlice = createSlice({
    name:"blogSlice",
    initialState,
    reducers:{
        setBlog:(state,action)=>{
            state.blogs =  action.payload
    }}
})


export const {setBlog} = blogSlice.actions
export default blogSlice.reducer