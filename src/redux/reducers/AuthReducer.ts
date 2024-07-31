import {
  SignUp,
  SignIn,
  GoogleAuth,
  checkMail,
  updateProfile,
} from '../actions/AuthActions';
import { Verify, Logout } from '../actions/AuthActions';
import { toast } from 'react-toastify';
import { ActionReducerMapBuilder, createSlice } from '@reduxjs/toolkit';
import { userReducerInitial, ErrorPayload } from '../../types/Helper';

const initialState: userReducerInitial = {
  loading: false,
  err: false,
  user: null,
  message: '',
  success: false,
  isUser: false,
  isAdmin: false,
};

const Authreducer = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetMessage: state => {
      state.message = '';
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<userReducerInitial>) => {
    builder
      .addCase(SignUp.pending, state => {
        state.loading = true;
      })
      .addCase(SignUp.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.err = false;
        state.user = payload.data;
        state.message = payload.message;
        state.success = payload.success;
      })
      .addCase(SignUp.rejected, (state, { payload }) => {
        state.loading = false;
        const errorPayload = payload as ErrorPayload;
        state.err = errorPayload.message;
        toast.error(errorPayload.message);
        state.user = null;
      })
      .addCase(Verify.pending, state => {
        state.loading = true;
      })
      .addCase(Verify.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.err = false;
        state.user = payload.data;
        state.message = payload.message;
        state.success = payload.success;
        state.isUser = true;
      })
      .addCase(Verify.rejected, (state, { payload }) => {
        state.loading = false;
        const errorPayload = payload as ErrorPayload;
        state.err = errorPayload.message;
        toast.error(errorPayload.message);
      })
      .addCase(Logout.pending, state => {
        state.loading = true;
      })
      .addCase(Logout.fulfilled, state => {
        state.loading = false;
        state.user = null;
        state.isAdmin = false;
        state.isUser = false;
      })
      .addCase(Logout.rejected, (state, { payload }) => {
        state.loading = false;
        const errorPayload = payload as ErrorPayload;
        state.err = errorPayload.message;
      })
      .addCase(SignIn.pending, state => {
        state.loading = true;
      })
      .addCase(SignIn.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.err = false;
        state.user = payload.data;
        state.message = payload.message;
        (state.success = payload.success),
          payload.isAdmin ? (state.isUser = false) : (state.isUser = true);

        state.isAdmin = payload.isAdmin;
      })
      .addCase(SignIn.rejected, (state, { payload }) => {
        state.loading = false;
        const errorPayload = payload as ErrorPayload;
        state.err = errorPayload.message;
        toast.error(errorPayload.message);
        state.user = null;
      })
      .addCase(GoogleAuth.pending, state => {
        state.loading = true;
      })
      .addCase(GoogleAuth.fulfilled, (state, { payload }) => {
        console.log('google', payload);

        state.loading = false;
        state.err = false;
        state.user = payload.data;
        state.message = payload.message;
        state.success = payload.success;
        state.isUser = true;
      })
      .addCase(GoogleAuth.rejected, (state, { payload }) => {
        state.loading = false;
        const errorPayload = payload as ErrorPayload;
        state.err = errorPayload.message;
        toast.error(errorPayload.message);
        state.user = null;
      })
      .addCase(checkMail.pending, state => {
        state.loading = true;
      })
      .addCase(checkMail.fulfilled, (state, { payload }) => {
        console.log('checkmail', payload);

        state.loading = false;
        state.err = false;
        state.user = payload.data;
        state.message = payload.message;
        state.success = payload.success;
      })
      .addCase(checkMail.rejected, (state, { payload }) => {
        state.loading = false;
        const errorPayload = payload as ErrorPayload;
        state.err = errorPayload.message;
        console.log(errorPayload.message);

        toast.error(errorPayload.message);
        state.user = null;
      })

      .addCase(updateProfile.pending, state => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, { payload }) => {
        console.log('update', payload);

        state.loading = false;
        state.err = false;
        state.user = payload.data;
        state.message = payload.message;
        state.success = payload.success;
      })
      .addCase(updateProfile.rejected, (state, { payload }) => {
        state.loading = false;
        const errorPayload = payload as ErrorPayload;
        state.err = errorPayload.message;
        console.log(errorPayload.message);

        toast.error(errorPayload.message);
        state.user = null;
      });
  },
});
export const { resetMessage } = Authreducer.actions;
export default Authreducer.reducer;
