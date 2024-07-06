import { AuthAxios } from "../../constants/AxiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { handleErrors } from "../../helper/HandleErrors";
import { Signup } from "../../types/userData";
import { ErrorPayload } from "../../types/Helper";

interface User {
  success: string;
  user: string;
  message: string;
}

export const SignUp = createAsyncThunk<
  User,
  Signup,
  { rejectValue: ErrorPayload }
>("user/userSignup", async (userData: Signup, { rejectWithValue }) => {
  try {
    console.log(userData);

    const { data } = await AuthAxios.post("/signup", {
      email:userData,
    });

    return data;
  } catch (error) {
    return rejectWithValue(handleErrors(error));
  }
});
