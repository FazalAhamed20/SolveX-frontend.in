import { AuthAxios } from "../../constants/AxiosInstance";
import {createAsyncThunk} from '@reduxjs/toolkit'
import { handleErrors } from "../../helper/HandleErrors";
import { Signup } from "../../types/userData";
import { ErrorPayload } from "../../types/Helper";

interface User{
  success:string,
  user: string;
  message:string,
}

export const SignUp =  createAsyncThunk<User, Signup, { rejectValue: ErrorPayload }>(
    "user/userSignup",
    async (userData: Signup, { rejectWithValue }) => {
      try {
        console.log(userData);
        
        const updatedUserData = { ...userData ,username:userData.name};
        
delete updatedUserData.name;
console.log(updatedUserData);

        const { data } = await AuthAxios.post("/signup", {
          ...updatedUserData,
          
        

        
        });
        console.log(data);
        
  
        return data;
      } catch (error) {
        return rejectWithValue(handleErrors(error));
      }
    }
  );