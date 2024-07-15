import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import AuthReducer from "./reducers/AuthReducer";
import AdminReducer from "./reducers/AdminReducer";


const rootReducer = combineReducers({
  user: AuthReducer,
  admin:AdminReducer
 
});


const persistConfig = {
  key: "root", 
  storage,

};


const persistedReducer = persistReducer(persistConfig, rootReducer);


const Store = configureStore({
  reducer: persistedReducer,
  
});


export const persistor = persistStore(Store);

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
export default Store;
