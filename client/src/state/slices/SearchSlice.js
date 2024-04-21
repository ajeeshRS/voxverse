import { createSlice } from "@reduxjs/toolkit"

const initialState= {
    searchResult:[]
}

const searchResultSlice = createSlice({
    name:"searchResultSlice",
    initialState,
    reducers:{
        setSearchResults:(state,action)=>{
            state.searchResult =  action.payload
    }}
})

export const {setSearchResults} = searchResultSlice.actions
export default searchResultSlice.reducer