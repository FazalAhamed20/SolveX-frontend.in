import {  SignUp,SignIn } from "../actions/AuthActions";
import { Verify,Logout } from "../actions/AuthActions";
import { toast } from "react-toastify";
import { ActionReducerMapBuilder, createSlice } from "@reduxjs/toolkit";
import { userReducerInitial,ErrorPayload } from "../../types/Helper";


const initialState: userReducerInitial = {
    loading: false,
    err: false,
    user: null,
    message: "",
    
  };
  
  const Authreducer = createSlice({
    name: "user",
    initialState,
    reducers: {
      resetMessage: (state) => {
        state.message = "";
      },
    },
    extraReducers: (builder: ActionReducerMapBuilder<userReducerInitial>) => {
      builder
        .addCase(SignUp.pending, (state) => {
          state.loading = true;
        })
        .addCase(SignUp.fulfilled, (state, { payload }) => {
          state.loading = false;
          state.err = false;
          console.log("Signup",payload);
          console.log("sing user",payload.data);
          
          
          state.user = payload.data;
          state.message = payload.message;
        
        })
        .addCase(SignUp.rejected, (state, { payload }) => {
          state.loading = false;
          
          console.log(payload);
          
          const errorPayload = payload as ErrorPayload;
          console.log(payload);
          state.err = errorPayload.message;
          toast.error(errorPayload.message);
          state.user = null;
        })
        .addCase(Verify.pending, (state) => {
          state.loading = true;
        })
        .addCase(Verify.fulfilled, (state, { payload }) => {
          state.loading = false;
          state.err = false;
         
          
          state.user=payload.data
          state.message = payload.message;
         
          
        })
        .addCase(Verify.rejected, (state, { payload }) => {
          state.loading = false;
          const errorPayload = payload as ErrorPayload;
          state.err = errorPayload.message;
          toast.error(errorPayload.message);
          
        })
        .addCase(Logout.pending, (state) => {
          state.loading = true;
        })
        .addCase(Logout.fulfilled, (state) => {
          state.loading = false;
          state.user = null;
        })
        .addCase(Logout.rejected, (state, {payload}) => {
          state.loading = false;
          const errorPayload = payload as ErrorPayload;
          state.err = errorPayload.message;
        })
        .addCase(SignIn.pending, (state) => {
          state.loading = true;
        })
        .addCase(SignIn.fulfilled, (state, { payload }) => {
          state.loading = false;
          state.err = false;
          console.log("Signup",payload);
          console.log("sing user",payload.data);
          
          
          state.user = payload.data;
          state.message = payload.message;
        
        })
        .addCase(SignIn.rejected, (state, { payload }) => {
          state.loading = false;
          
          console.log(payload);
          
          const errorPayload = payload as ErrorPayload;
          console.log(payload);
          state.err = errorPayload.message;
          toast.error(errorPayload.message);
          state.user = null;
        })
        
    },
});
export const {resetMessage}= Authreducer.actions
export default Authreducer.reducer