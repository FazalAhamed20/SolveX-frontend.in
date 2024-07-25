import { SubmissionAxios } from '../../config/AxiosInstance';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { handleErrors } from '../../helper/HandleErrors';
import { Submission } from '../../types/userData';
import { ErrorPayload } from '../../types/Helper';

interface VerifyResponse {
    success: any;
    data:string;
    message: string;
    status?: number;
    isSubmit?: boolean;
  }


export const submitProblem= createAsyncThunk<
  VerifyResponse,
  Submission,
  { rejectValue: ErrorPayload }
>('problem/problemBlock', async (submissionData: Submission, { rejectWithValue }) => {
  try {
    console.log('......',submissionData);

    const { data } = await SubmissionAxios.post<VerifyResponse>('/submit', {
        code:submissionData.code,
        email:submissionData.email,
        title:submissionData.title,
        difficulty:submissionData.difficuly,
        id:submissionData.id,
        language:submissionData.language,
        isSubmit:submissionData.isSubmit

       

      
    });
    console.log('data', data);

    return data;
  } catch (error: any) {
    console.log(error);
    return rejectWithValue(handleErrors(error));
  }
});


export const fetchSubmission= createAsyncThunk<
  VerifyResponse,
  Submission,
  { rejectValue: ErrorPayload }
>('problem/problemBlock', async (fetch: Submission, { rejectWithValue }) => {
  try {
    console.log('data',fetch);

    const { data } = await SubmissionAxios.post<VerifyResponse>('/fetchSubmission', {
        email:fetch.email,
        id:fetch.id
       
        

       

      
    });
    console.log('data', data);

    return data;
  } catch (error: any) {
    console.log(error);
    return rejectWithValue(handleErrors(error));
  }
});