import AuthAxios from '../../config/AxiosInstance';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { handleErrors } from '../../helper/HandleErrors';
import { Signin, Signup, Profile } from '../../types/userData';
import { ErrorPayload } from '../../types/Helper';

interface VerifyResponse {
  success: any;
  data: string;
  message: string;
  status?: number;
  isAdmin?: boolean;
  isBlocked?: boolean;
}
interface LogoutResponse {
  success: boolean;
  message: string;
}

export const SignUp = createAsyncThunk<
  VerifyResponse,
  String,
  { rejectValue: ErrorPayload }
>('user/userSignup', async (userData: String, { rejectWithValue }) => {
  try {
    

    const { data } = await AuthAxios.post<VerifyResponse>('/signup', {
      email: userData,
    });
    

    return data;
  } catch (error: any) {
    

    return rejectWithValue(handleErrors(error));
  }
});

export const Verify = createAsyncThunk<
  VerifyResponse,
  Signup,
  { rejectValue: ErrorPayload }
>('user/userVerify', async (userData: Signup, { rejectWithValue }) => {
  

  try {
    const { data } = await AuthAxios.post<VerifyResponse>('/verify', userData);
    return data;
  } catch (error) {
    return rejectWithValue(handleErrors(error));
  }
});

export const SignIn = createAsyncThunk<
  VerifyResponse,
  Signin,
  { rejectValue: ErrorPayload }
>('user/userSignIn', async (userData: Signin, { rejectWithValue }) => {
  try {
    

    const { data } = await AuthAxios.post<VerifyResponse>('/login', {
      email: userData.email,
      password: userData.password,
    });
    

    return data;
  } catch (error: any) {
    

    return rejectWithValue(handleErrors(error));
  }
});

export const Logout = createAsyncThunk<
  LogoutResponse,
  void,
  { rejectValue: ErrorPayload }
>('user/logout', async (_, { rejectWithValue }) => {
  try {
   
     await AuthAxios.post<LogoutResponse>('/logout');
  

    return { success: true, message: 'Logged out successfully' };
  } catch (error: any) {
    
    return rejectWithValue(handleErrors(error));
  }
});

export const GoogleAuth = createAsyncThunk<
  VerifyResponse,
  Signup,
  { rejectValue: ErrorPayload }
>('user/userGoogleAuth', async (userData: Signup, { rejectWithValue }) => {


  try {
    const { data } = await AuthAxios.post<VerifyResponse>(
      '/googleAuth',
      userData,
    );
    return data;
  } catch (error) {
    return rejectWithValue(handleErrors(error));
  }
});

export const checkMail = createAsyncThunk<
  VerifyResponse,
  String,
  { rejectValue: ErrorPayload }
>('user/userCheckMail', async (userData: String, { rejectWithValue }) => {
  

  try {
    const { data } = await AuthAxios.post<VerifyResponse>('/checkmail', {
      email: userData,
    });
    return data;
  } catch (error) {
    return rejectWithValue(handleErrors(error));
  }
});

export const updateProfile = createAsyncThunk<
  VerifyResponse,
  Profile,
  { rejectValue: ErrorPayload }
>('user/userProfile', async (userData: Profile, { rejectWithValue }) => {


  try {
    const { data } = await AuthAxios.post<VerifyResponse>('/ProfileUpdate', {
      email: userData.email,
      profileImage: userData.profileImage,
      bio: userData.bio,
      username: userData.username,
      role: userData.role,
      linkedin: userData.linkedin,
      github: userData.github,
      twitter: userData.twitter,
    });
    return data;
  } catch (error) {
    return rejectWithValue(handleErrors(error));
  }
});

export const ResendOtp = createAsyncThunk<
  VerifyResponse,
  String,
  { rejectValue: ErrorPayload }
>('user/userResendOtp', async (userData: String, { rejectWithValue }) => {
  try {


    const { data } = await AuthAxios.post<VerifyResponse>('/resendotp', {
      email: userData,
    });


    return data;
  } catch (error: any) {
    

    return rejectWithValue(handleErrors(error));
  }
});
