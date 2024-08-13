import { ClanAxios } from '../../config/AxiosInstance';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { handleErrors } from '../../helper/HandleErrors';
import { Clan } from '../../types/userData';
import { ErrorPayload } from '../../types/Helper';
import { toast } from 'react-toastify';

interface VerifyResponse {
  success: any;
  data: Clan[];
  message: string;
  status?: number;
  isBlocked?: boolean;
}

export const createClan = createAsyncThunk<
  VerifyResponse,
  Clan,
  { rejectValue: ErrorPayload }
>('clan/createClan', async (clanData: Clan, { rejectWithValue }) => {
  try {
    console.log('clanData', clanData);

    const { data } = await ClanAxios.post<VerifyResponse>('/create-clan', {
      id: clanData.id,
      name: clanData.name,
      description: clanData.description,
      members: clanData.members,
      trophies: clanData.trophies,
      userId: clanData.userId,
    });
    console.log('data', data);

    return data;
  } catch (error: any) {
    console.log(error);
    return rejectWithValue(handleErrors(error));
  }
});
export const fetchAllClan = createAsyncThunk<
  VerifyResponse,
  void,
  { rejectValue: ErrorPayload }
>('clan/fetchClan', async (_, { rejectWithValue }) => {
  try {
    const { data } = await ClanAxios.get<VerifyResponse>(
      '/fetch-all-clans',
      {},
    );
    console.log('data fetch All Clans', data);

    return data;
  } catch (error: any) {
    console.log(error);
    return rejectWithValue(handleErrors(error));
  }
});

export const fetchMember = createAsyncThunk<
  VerifyResponse,
  Clan,
  { rejectValue: ErrorPayload }
>('clan/fetchMember', async (clanData: Clan, { rejectWithValue }) => {
  try {
    console.log('clanData', clanData);

    const { data } = await ClanAxios.post<VerifyResponse>('/fetchmember', {
      id: clanData.clanId,
      name: clanData.name,
    });
    console.log('data', data);

    return data;
  } catch (error: any) {
    console.log(error);
    return rejectWithValue(handleErrors(error));
  }
});

export const fetchAllUsers = createAsyncThunk<
  VerifyResponse,
  void,
  { rejectValue: ErrorPayload }
>('clan/fetchClan', async (_, { rejectWithValue }) => {
  try {
    const { data } = await ClanAxios.get<VerifyResponse>('/fetch-all-users');
    console.log('data', data);

    return data;
  } catch (error: any) {
    console.log(error);
    return rejectWithValue(handleErrors(error));
  }
});

export const addMember = createAsyncThunk<
  VerifyResponse,
  Clan,
  { rejectValue: ErrorPayload }
>('clan/create-member', async (clanData: Clan, { rejectWithValue }) => {
  try {
    console.log('clanData', clanData);
    // Prepare the request payload
    const membersData = clanData.members?.map(member => ({
      id: member.id,
      name: member.name,
      role: member.role,
    }));

    const { data } = await ClanAxios.post<VerifyResponse>('/add-member', {
      _id: clanData.clanId,
      members: membersData,

      name: clanData.name,
    });
    console.log('data', data);

    return data;
  } catch (error: any) {
    console.log(error.response.data);
    toast.error(error.response.data);
    return rejectWithValue(handleErrors(error));
  }
});
export const removeMember = createAsyncThunk<
  VerifyResponse,
  { clanId: any; _id: string; memberName: string },
  { rejectValue: ErrorPayload }
>(
  'clan/remove-member',
  async ({ clanId, _id, memberName }, { rejectWithValue }) => {
    try {
      // Prepare the request payload
      const response = await ClanAxios.delete(
        `/clans/${clanId}/members/${_id}/${memberName}`,
      );
      return response.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(handleErrors(error));
    }
  },
);

export const blockClan = createAsyncThunk<
  VerifyResponse,
  { id: string; isBlocked: boolean },
  { rejectValue: ErrorPayload }
>('clan/clanBlock', async ({ id, isBlocked }, { rejectWithValue }) => {
  try {
    const { data } = await ClanAxios.post<VerifyResponse>(`/blockclan/${id}`, {
      isBlocked,
    });
    console.log('data', data);

    return data;
  } catch (error: any) {
    console.log(error);
    return rejectWithValue(handleErrors(error));
  }
});

export const leaveClan = createAsyncThunk<
  VerifyResponse,
  { clanId: string; _id: string ,memberName:string},
  { rejectValue: ErrorPayload }
>(
  'clan/remove-member',
  async ({ clanId,_id,memberName}, { rejectWithValue }) => {
    try {
      
      const response = await ClanAxios.delete('/clans/leaveclan', {
        data: { clanId, _id ,memberName }
      });
      return response.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(handleErrors(error));
    }
  },
);

export const joinRequest = createAsyncThunk<
  VerifyResponse,
  { clanId: string;userId: string },
  { rejectValue: ErrorPayload }
>(
  'clan/request-clan',
  async ({ clanId,userId}, { rejectWithValue }) => {
    try {
      
      const response = await ClanAxios.post('/request-clan', {
       clanId,userId
      });
      return response.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(handleErrors(error));
    }
  },
);
