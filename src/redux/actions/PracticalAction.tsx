import { PracticeAxios } from '../../config/AxiosInstance';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { handleErrors } from '../../helper/HandleErrors';
import { Practice } from '../../types/userData';
import { ErrorPayload } from '../../types/Helper';

interface VerifyResponse {
  success: any;
  data: [];
  message: string;
  status?: number;
  isBlocked?: boolean;
}

export const blockPractical = createAsyncThunk<
  VerifyResponse,
  Practice,
  { rejectValue: ErrorPayload }
>(
  'problem/practiceBlock',
  async (practiceData: Practice, { rejectWithValue }) => {
    try {
      console.log(practiceData);

      const { data } = await PracticeAxios.post<VerifyResponse>(
        '/blockPractice',
        {
          _id: practiceData._id,
          isBlocked: practiceData.isBlocked,
        },
      );
      console.log('data', data);

      return data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(handleErrors(error));
    }
  },
);

export const practicallist = createAsyncThunk<
  Practice[],
  void,
  { rejectValue: ErrorPayload }
>('practical/practicelist', async (_, { rejectWithValue }) => {
  try {
    const { data } = await PracticeAxios.get<Practice[]>('/practicelist', {});
    console.log('data', data);

    return data;
  } catch (error: any) {
    console.log(error);
    return rejectWithValue(handleErrors(error));
  }
});