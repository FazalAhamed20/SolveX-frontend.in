import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./reducers/AuthReducer";

const Store = configureStore({
    reducer:{
        user:AuthReducer
    }
})

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
export default Store