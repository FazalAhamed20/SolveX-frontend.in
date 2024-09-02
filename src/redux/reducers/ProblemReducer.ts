import { createSlice, ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { problemlist } from '../actions/ProblemActions';
import { toast } from 'react-toastify';
import { problemReducerInitial, ErrorPayload } from '../../types/Helper';

const initialState: problemReducerInitial = {
  loading: false,
  err: false,
  problem: [],
  message: '',
  success: false,
};

const Problemreducer = createSlice({
  name: 'problem',
  initialState,
  reducers: {
    resetMessage: state => {
      state.message = '';
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<problemReducerInitial>) => {
    builder
      .addCase(problemlist.pending, state => {
        state.loading = true;
      })
      .addCase(problemlist.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.err = false;
        state.problem = payload;
        ('prob', payload);
        state.message = 'Problems fetched successfully';
        state.success = true;
      })
      .addCase(problemlist.rejected, (state, { payload }) => {
        state.loading = false;
        const errorPayload = payload as ErrorPayload;
        state.err = true;
        state.message = errorPayload.message;
        toast.error(errorPayload.message);
        state.problem = [];
      });
  },
});

export const { resetMessage } = Problemreducer.actions;
export default Problemreducer.reducer;
