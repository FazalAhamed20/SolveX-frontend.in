import { createSlice, ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { submissionReducerInitial, ErrorPayload } from '../../types/Helper';
import { submitProblem } from '../actions/SubmissionAction';

const initialState: submissionReducerInitial = {
  loading: false,
  err: false,
  data: null,
  message: '',
  success: false,
};

const Submissionreducer = createSlice({
  name: 'submission',
  initialState,
  reducers: {
    resetMessage: state => {
      state.message = '';
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<submissionReducerInitial>) => {
    builder
      .addCase(submitProblem.pending, state => {
        state.loading = true;
      })
      .addCase(submitProblem.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.err = false;
        state.data = payload; 
        state.message = 'Submitted successfully';
        state.success = true;
      })
      .addCase(submitProblem.rejected, (state, { payload }) => {
        state.loading = false;
        const errorPayload = payload as ErrorPayload;
        state.err = true;
        state.message = errorPayload.message;
        toast.error(errorPayload.message);
        state.data =null;
      });
  },
});

export const { resetMessage } = Submissionreducer.actions;
export default Submissionreducer.reducer;
