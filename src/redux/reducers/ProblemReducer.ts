import  {problemlist} from '../actions/ProblemActions'
import { toast } from 'react-toastify';
import { ActionReducerMapBuilder, createSlice } from '@reduxjs/toolkit';
import { problemReducerInitial, ErrorPayload } from '../../types/Helper';

const initialState: problemReducerInitial = {
  loading: false,
  err: false,
  problem:[],
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
        console.log(payload.data);

        state.loading = false;
        state.err = false;
        state.problem = payload.data;
        state.message = payload.message;
        state.success = payload.success;
      })
      .addCase(problemlist.rejected, (state, { payload }) => {
        state.loading = false;
        const errorPayload = payload as ErrorPayload;
        state.err = errorPayload.message;
        toast.error(errorPayload.message);
        state.problem = [];
      });
  },
});
export const { resetMessage } = Problemreducer.actions;
export default Problemreducer.reducer;
