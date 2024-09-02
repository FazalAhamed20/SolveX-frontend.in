import { createSlice, ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { practicallist } from '../actions/PracticalAction';
import { toast } from 'react-toastify';
import { practicalReducerInitial, ErrorPayload } from '../../types/Helper';

const initialState: practicalReducerInitial = {
  loading: false,
  err: false,
  practical: [],
  message: '',
  success: false,
};

const Practicalreducer = createSlice({
  name: 'practical',
  initialState,
  reducers: {
    resetMessage: state => {
      state.message = '';
    },
  },
  extraReducers: (
    builder: ActionReducerMapBuilder<practicalReducerInitial>,
  ) => {
    builder
      .addCase(practicallist.pending, state => {
        state.loading = true;
      })
      .addCase(practicallist.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.err = false;
        state.practical = payload;
        
        state.message = 'Problems fetched successfully';
        state.success = true;
      })
      .addCase(practicallist.rejected, (state, { payload }) => {
        state.loading = false;
        const errorPayload = payload as ErrorPayload;
        state.err = true;
        state.message = errorPayload.message;
        toast.error(errorPayload.message);
        state.practical = [];
      });
  },
});

export const { resetMessage } = Practicalreducer.actions;
export default Practicalreducer.reducer;
