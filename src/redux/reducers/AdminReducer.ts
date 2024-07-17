import { blockUser } from "../actions/AdminActions";

import { toast } from "react-toastify";
import { ActionReducerMapBuilder, createSlice } from "@reduxjs/toolkit";
import { adminReducerInitial, ErrorPayload } from "../../types/Helper";

const initialState: adminReducerInitial = {
  loading: false,
  err: false,
  user: null,
  message: "",
  success:false,


  
};

const Adminreducer = createSlice({
  name: "admin",
  initialState,
  reducers: {
    resetMessage: (state) => {
      state.message = "";
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<adminReducerInitial>) => {
    builder
      .addCase(blockUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(blockUser.fulfilled, (state, { payload }) => {
        console.log(payload.data);
        
        state.loading = false;
        state.err = false;
        state.user = payload.data;
        state.message = payload.message;
        state.success=payload.success;
      })
      .addCase(blockUser.rejected, (state, { payload }) => {
        state.loading = false;
        const errorPayload = payload as ErrorPayload;
        state.err = errorPayload.message;
        toast.error(errorPayload.message);
        state.user = null;
      })
      
  },
});
export const { resetMessage } = Adminreducer.actions;
export default Adminreducer.reducer;
