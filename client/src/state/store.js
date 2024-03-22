
import {configureStore} from "@reduxjs/toolkit"
import ToggleReducer from "./slices/ToggleSlice"
import UserStateReducer from "./slices/UserStateSlice"
import otpStateReducer from "./slices/OtpSlice"

export const store =configureStore({
    reducer:{
        toggleMenu:ToggleReducer,
        userState: UserStateReducer,
        toggleState:otpStateReducer
    }
})

