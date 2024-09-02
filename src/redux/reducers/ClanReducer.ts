import { createSlice, ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { createClan } from '../actions/ClanAction';
import { toast } from 'react-toastify';
import { clanReducerInitial, ErrorPayload } from '../../types/Helper';

const initialState: clanReducerInitial = {
  loading: false,
  err: false,
  clan: [],
  message: '',
  success: false,
};

const Clanreducer = createSlice({
  name: 'clan',
  initialState,
  reducers: {
    resetMessage: state => {
      state.message = '';
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<clanReducerInitial>) => {
    builder
      .addCase(createClan.pending, state => {
        state.loading = true;
      })
      .addCase(createClan.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.err = false;
        
        state.message = 'Clan created successfully';
        state.success = true;
      })
      .addCase(createClan.rejected, (state, { payload }) => {
        state.loading = false;
        const errorPayload = payload as ErrorPayload;
        state.err = true;
        state.message = errorPayload?.message || 'An unknown error occurred';
        toast.error(state.message);
        console.error('Error creating clan:', errorPayload);
      });
  },
});

export const { resetMessage } = Clanreducer.actions;
export default Clanreducer.reducer;
