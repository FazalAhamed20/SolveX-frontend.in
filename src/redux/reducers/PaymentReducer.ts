import { createSlice, ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { addSubscriptions, createPayment } from '../actions/PaymentAction';
import { toast } from 'react-toastify';
import { paymentReducerInitial, ErrorPayload } from '../../types/Helper';

const initialState: paymentReducerInitial = {
  loading: false,
  err: false,
  payment: [],
  message: '',
  success: false,
};

const Paymentreducer = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    resetMessage: state => {
      state.message = '';
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<paymentReducerInitial>) => {
    builder
      .addCase(addSubscriptions.pending, state => {
        state.loading = true;
      })
      .addCase(addSubscriptions.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.err = false;
        console.log('Payload received:', payload);
        state.message = 'Subscription created successfully';
        // toast.success(state.message);
        state.success = true;
      })
      .addCase(addSubscriptions.rejected, (state, { payload }) => {
        state.loading = false;
        const errorPayload = payload as ErrorPayload;
        state.err = true;
        state.message = errorPayload?.message || 'An unknown error occurred';
        toast.error(state.message);
        console.error('Error creating clan:', errorPayload);
      })
      .addCase(createPayment.pending, state => {
        state.loading = true;
      })
      .addCase(createPayment.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.err = false;
        console.log('Payload received:', payload);
        state.message = 'Payment created successfully';
        // toast.success(state.message);
        state.success = true;
      })
      .addCase(createPayment.rejected, (state, { payload }) => {
        state.loading = false;
        const errorPayload = payload as ErrorPayload;
        state.err = true;
        state.message = errorPayload?.message || 'An unknown error occurred';
        console.log('payment message',state.message)
        toast.error(state.message);
        console.error('Error creating payment:', errorPayload);
      });
  },
});

export const { resetMessage } = Paymentreducer.actions;
export default Paymentreducer.reducer;
