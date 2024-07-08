import { AuthAxios } from "../../constants/AxiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { handleErrors } from "../../helper/HandleErrors";
import { Signin, Signup } from "../../types/userData";
import { ErrorPayload } from "../../types/Helper";


interface User {
  success: boolean;
  data: string;
  message: string;
  status:number
}
interface VerifyResponse {
  success: boolean;
  data:string,
  message: string;
  status:any
 
}
interface LogoutResponse {
  success: boolean;
  message: string;
}

export const SignUp = createAsyncThunk<
  User,
  String,
  { rejectValue: ErrorPayload }
>("user/userSignup", async (userData: String, { rejectWithValue }) => {
  try {
    console.log(userData);

    const { data } = await AuthAxios.post<User>("/signup", {
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
  User,
 Signin,
 
  { rejectValue: ErrorPayload }
>("user/userSignIn", async (userData: Signin, { rejectWithValue }) => {
  try {
    console.log(userData.email);

    const { data } = await AuthAxios.post<User>("/login", {
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












