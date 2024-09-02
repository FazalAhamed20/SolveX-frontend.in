import { AdminAxios } from '../../config/AxiosInstance';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { handleErrors } from '../../helper/HandleErrors';
import { UserData } from '../../types/userData';
import { ErrorPayload } from '../../types/Helper';

interface VerifyResponse {
  success: any;
  data: string;
  message: string;
  status?: number;
  isBlocked?: boolean;
}

export const blockUser = createAsyncThunk<
  VerifyResponse,
  UserData,
  { rejectValue: ErrorPayload }
>('admin/adminBlock', async (userData: UserData, { rejectWithValue }) => {
  try {
    

    const { data } = await AdminAxios.post<VerifyResponse>('/blockuser', {
      email: userData.email,
      isBlocked: userData.isBlocked,
    });
    

    return data;
  } catch (error: any) {
    
    return rejectWithValue(handleErrors(error));
  }
});
