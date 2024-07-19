import { ProblemAxios } from '../../config/AxiosInstance';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { handleErrors } from '../../helper/HandleErrors';
import { Problem } from '../../types/userData';
import { ErrorPayload } from '../../types/Helper';

interface VerifyResponse {
  success: any;
  data:[];
  message: string;
  status?: number;
  isBlocked?: boolean;
}

export const blockProblem= createAsyncThunk<
  VerifyResponse,
  Problem,
  { rejectValue: ErrorPayload }
>('problem/problemBlock', async (problemData: Problem, { rejectWithValue }) => {
  try {
    console.log(problemData);

    const { data } = await ProblemAxios.post<VerifyResponse>('/blockproblem', {
      _id:problemData._id,
      isBlocked:problemData.isBlocked
    });
    console.log('data', data);

    return data;
  } catch (error: any) {
    console.log(error);
    return rejectWithValue(handleErrors(error));
  }
});

export const problemlist= createAsyncThunk<
  Problem[],
  void,
  { rejectValue: ErrorPayload }
>('problem/problemlist', async (_, { rejectWithValue }) => {
  try {
   

    const { data } = await ProblemAxios.get<Problem[]>('/problemlist', {
     
    });
    console.log('data', data);

    return data;
  } catch (error: any) {
    console.log(error);
    return rejectWithValue(handleErrors(error));
  }
});
