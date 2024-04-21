
import {configureStore} from "@reduxjs/toolkit"
import ToggleReducer from "./slices/ToggleSlice"
import UserStateReducer from "./slices/UserStateSlice"
import otpStateReducer from "./slices/OtpSlice"
import blogReducer  from "./slices/BlogSlice"
import allBlogReducer from "./slices/AllBlogSlice"
import searchResultReducer from "./slices/SearchSlice"
export const store =configureStore({
    reducer:{
        toggleMenu:ToggleReducer,
        userState: UserStateReducer,
        toggleState:otpStateReducer,
        blogState :blogReducer,
        allBlogState :allBlogReducer,
        searchResultState :searchResultReducer
    },

})

