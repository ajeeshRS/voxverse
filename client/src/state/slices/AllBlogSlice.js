import { createSlice } from "@reduxjs/toolkit"

const initialState= {
    allBlogs:[]
}

const allBlogSlice = createSlice({
    name:"allBlogSlice",
    initialState,
    reducers:{
        setAllBlogs:(state,action)=>{
            state.allBlogs =  action.payload
    }}
})

export const {setAllBlogs} = allBlogSlice.actions
export default allBlogSlice.reducer