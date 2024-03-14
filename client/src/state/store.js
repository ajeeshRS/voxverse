
import {configureStore} from "@reduxjs/toolkit"
import ToggleReducer from "./slices/ToggleSlice"

export const store =configureStore({
    reducer:{
        toggleMenu:ToggleReducer
    }
})

