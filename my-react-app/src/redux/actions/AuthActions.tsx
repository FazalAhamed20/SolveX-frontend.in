import { AuthAxios } from "../../constants/AxiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { handleErrors } from "../../helper/HandleErrors";
import { Signin, Signup } from "../../types/userData";
import { ErrorPayload } from "../../types/Helper";



interface VerifyResponse {
  success: any;
  data:string,
  message: string;
 
}
interface LogoutResponse {
  success: boolean;
  message: string;
}

export const SignUp = createAsyncThunk<
  VerifyResponse,
  String,
  { rejectValue: ErrorPayload }
>("user/userSignup", async (userData: String, { rejectWithValue }) => {
  try {
    console.log(userData);

    const { data } = await AuthAxios.post<VerifyResponse>("/signup", {
      email: userData,
    });
    console.log("data",data);
    

    return data
  } catch (error:any) {
    console.log(error);
    
    return rejectWithValue(handleErrors(error));
  }
});

export const Verify = createAsyncThunk<
  VerifyResponse,
  Signup,
  { rejectValue: ErrorPayload }
>("user/userVerify", async (userData: Signup, { rejectWithValue }) => {
  console.log("otp userdata",userData);
  
  try {
    const { data } = await AuthAxios.post<VerifyResponse>("/verify", userData);
    return data;
  } catch (error) {
    return rejectWithValue(handleErrors(error));
  }
});

export const SignIn = createAsyncThunk<
  VerifyResponse,
 Signin,
 
  { rejectValue: ErrorPayload }
>("user/userSignIn", async (userData: Signin, { rejectWithValue }) => {
  try {
    console.log(userData.email);

    const { data } = await AuthAxios.post<VerifyResponse>("/login", {
      email:userData.email,
      password:userData.password
    });
    console.log("data",data);
    

    return data
  } catch (error:any) {
    console.log(error);
    
    return rejectWithValue(handleErrors(error));
  }
});

export const Logout = createAsyncThunk<
  LogoutResponse,
  void,
  { rejectValue: ErrorPayload }
>("user/logout", async (_, { rejectWithValue }) => {
  try {
    
    const { data } = await AuthAxios.post<LogoutResponse>("/logout");
    console.log(data);

   

    return { success: true, message: "Logged out successfully" };
  } catch (error: any) {
    console.log(error);
    return rejectWithValue(handleErrors(error));
  }
});

export const GoogleAuth = createAsyncThunk<
  VerifyResponse,
  Signup,
  { rejectValue: ErrorPayload }
>("user/userGoogleAuth", async (userData: Signup, { rejectWithValue }) => {
  console.log("Auth",userData);
  
  try {
    const { data } = await AuthAxios.post<VerifyResponse>("/googleAuth", userData);
    return data;
  } catch (error) {
    return rejectWithValue(handleErrors(error));
  }
});













