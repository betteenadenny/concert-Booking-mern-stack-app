import { configureStore } from "@reduxjs/toolkit";

import authReducer from './authSlice';

let store = configureStore({
    reducer:{
        auth:authReducer
    }
});

export default store;