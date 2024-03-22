import { createSlice } from "@reduxjs/toolkit"

const initialState= {
    user:{}
}

const userStateSlice = createSlice({
    name:"userStateSlice",
    initialState,
    reducers:{
        setUser:(state,action)=>{
            state.user = action.payload
            
    },
    setUserState :(state)=>{
        state.value = true
    }
}
})

export const {setUser,setUserState} = userStateSlice.actions
export default userStateSlice.reducer