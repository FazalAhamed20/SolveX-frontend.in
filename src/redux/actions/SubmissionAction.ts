import { SubmissionAxios } from '../../config/AxiosInstance';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { handleErrors } from '../../helper/HandleErrors';
import { Submission } from '../../types/userData';
import { ErrorPayload } from '../../types/Helper';

interface VerifyResponse {
  [x: string]: any;
  payload: any;
  success: any;
  data: string | null;
  message: string;
  status?: number;
  submited: string;
}
interface ProblemData {
  email: string;
}

export const submitProblem = createAsyncThunk<
  VerifyResponse,
  Submission,
  { rejectValue: ErrorPayload }
>(
  'submission/submit',
  async (submissionData: Submission, { rejectWithValue }) => {
    try {
      console.log('......', submissionData);

      const { data } = await SubmissionAxios.post<VerifyResponse>('/submit', {
        code: submissionData.code,
        email: submissionData.email,
        title: submissionData.title,
        difficulty: submissionData.difficuly,
        id: submissionData.id,
        language: submissionData.language,
        submited: submissionData.submited,
      });
      console.log('data', data);

      return data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(handleErrors(error));
    }
  },
);

export const fetchSubmission = createAsyncThunk<
  VerifyResponse,
  Submission,
  { rejectValue: ErrorPayload }
>('submission/fetchSubmission', async (fetch: Submission, { rejectWithValue }) => {
  try {
    console.log('data', fetch);

    const { data } = await SubmissionAxios.post<VerifyResponse>(
      '/fetchSubmission',
      {
        email: fetch.email,
        id: fetch.id,
      },
    );
    console.log('data', data);

    return data;
  } catch (error: any) {
    console.log(error);
    return rejectWithValue(handleErrors(error));
  }
});

export const fetchSolved = createAsyncThunk<
  VerifyResponse,
  ProblemData,
  { rejectValue: ErrorPayload }
>(
  'submission/fetch',
  async (problemData: ProblemData, { rejectWithValue }) => {
    try {
      console.log('problem', problemData);

      const { data } = await SubmissionAxios.post<VerifyResponse>(
        '/fetchSolved',
        {
          email: problemData.email,
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


export const fetchPracticalSubmit = createAsyncThunk<
  VerifyResponse,
  Submission,
  { rejectValue: ErrorPayload }
>('submission/fetchPracticalSubmit', async (fetch: Submission, { rejectWithValue }) => {
  try {
    console.log('data', fetch);

    const { data } = await SubmissionAxios.post<VerifyResponse>(
      '/fetchpractical',
      {
        email: fetch.email,
        id: fetch.id,
      },
    );
    console.log('data', data);

    return data;
  } catch (error: any) {
    console.log(error);
    return rejectWithValue(handleErrors(error));
  }
});


export const fetchSolvedPracticals = createAsyncThunk<
  VerifyResponse,
  ProblemData,
  { rejectValue: ErrorPayload }
>(
  'submission/fetch',
  async (problemData: ProblemData, { rejectWithValue }) => {
    try {
      console.log('problem', problemData);

      const { data } = await SubmissionAxios.post<VerifyResponse>(
        '/fetchsolved-practicals',
        {
          email: problemData.email,
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

export const fetchAllSubmission = createAsyncThunk<
  Submission[],
  void,
  { rejectValue: ErrorPayload }
>('submission/submissionlist', async (_, { rejectWithValue }) => {
  try {
    const { data } = await SubmissionAxios.get<Submission[]>('/submissionlist', {});
    console.log('data', data);

    return data;
  } catch (error: any) {
    console.log(error);
    return rejectWithValue(handleErrors(error));
  }
});
