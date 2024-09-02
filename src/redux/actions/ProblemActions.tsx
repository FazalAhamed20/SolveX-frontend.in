import { ProblemAxios } from '../../config/AxiosInstance';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { handleErrors } from '../../helper/HandleErrors';
import { Problem } from '../../types/userData';
import { ErrorPayload } from '../../types/Helper';

interface VerifyResponse {
  success: any;
  data: [];
  message: string;
  status?: number;
  isBlocked?: boolean;
}

export const blockProblem = createAsyncThunk<
  VerifyResponse,
  Problem,
  { rejectValue: ErrorPayload }
>('problem/problemBlock', async (problemData: Problem, { rejectWithValue }) => {
  try {
    

    const { data } = await ProblemAxios.post<VerifyResponse>('/blockproblem', {
      _id: problemData._id,
      isBlocked: problemData.isBlocked,
    });
    

    return data;
  } catch (error: any) {
    
    return rejectWithValue(handleErrors(error));
  }
});

export const problemlist = createAsyncThunk<
  Problem[],
  void,
  { rejectValue: ErrorPayload }
>('problem/problemlist', async (_, { rejectWithValue }) => {
  try {
    const { data } = await ProblemAxios.get<Problem[]>('/problemlist', {});
    

    return data;
  } catch (error: any) {
    
    return rejectWithValue(handleErrors(error));
  }
});

export const updatePremiumStatus = createAsyncThunk<
  VerifyResponse,
  Problem,
  { rejectValue: ErrorPayload }
>(
  'problem/premiumStatus',
  async (problemData: Problem, { rejectWithValue }) => {
    try {
      

      const { data } = await ProblemAxios.post<VerifyResponse>(
        '/blockProblem',
        {
          _id: problemData._id,
          isPremium: problemData.isPremium,
        },
      );
      

      return data;
    } catch (error: any) {
      
      return rejectWithValue(handleErrors(error));
    }
  },
);
