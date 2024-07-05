import { SignUp } from "../actions/AuthActions";
import toast from "react-hot-toast";
import { ActionReducerMapBuilder, createSlice } from "@reduxjs/toolkit";
import { userReducerInitial,ErrorPayload } from "../../types/Helper";


const initialState: userReducerInitial = {
    loading: false,
    err: false,
    user: null,
    message: "",
    status: "",
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
          state.user = payload.user;
          state.message = payload.message;
          toast.success("An OTP has been sent to user email", {
            className: "text-center",
          });
        })
        .addCase(SignUp.rejected, (state, { payload }) => {
          state.loading = false;
          const errorPayload = payload as ErrorPayload;
          state.err = errorPayload.message;
          toast.error(errorPayload.message);
          state.user = null;
        })
    },
});
export const {resetMessage}= Authreducer.actions
export default Authreducer.reducer