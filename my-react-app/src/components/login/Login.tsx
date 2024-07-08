import React  from "react";
import { Formik,Form,Field,ErrorMessage } from "formik";
import { userLoginValidation } from "../../validation/UserLogin";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/Store";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { SignIn } from "../../redux/actions/AuthActions";

const Login: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
 
const initialValues={
  name:'',email:''
}
const [data, setData] = useState({
 
  email: "",
  password: "",
 
});


const handleSubmit = async (values: any) => {
  ;
  

  const response = await dispatch(SignIn(values));
  console.log("SignUp response:", response);

  if (response.payload && response.payload.message === "OTP Created") {
   
  } else {
    toast.error(`${response.payload?.message}`);
  }
};

  const handleGoogleLogin = () => {
    // Implement Google login logic here
    console.log("Google login clicked");
  };

  const handleLinkedInLogin = () => {
    // Implement LinkedIn login logic here
    console.log("LinkedIn login clicked");
  };

  const handleGitHubLogin = () => {
    // Implement GitHub login logic here
    console.log("GitHub login clicked");
  };

  const handleFacebookLogin = () => {
    // Implement Facebook login logic here
    console.log("Facebook login clicked");
  };

  return (
    <div className="flex justify-center items-center bg-white h-screen">
      <div className="w-full max-w-4xl px-4 sm:px-0">
        <div className="flex flex-col lg:flex-row gap-5">
          <div className="flex items-center justify-center w-full lg:w-1/2 ">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/3237df55a7454687bc27b3e9e3d38470613cab1fc208242a27bc7cd9c458e8dc?"
              className="w-full aspect-video lg:aspect-auto"
            />
          </div>
          
          <div className="flex flex-col w-full lg:w-1/2">
            <div className="flex flex-col p-8 bg-white rounded shadow-lg">
              <div className="text-xl font-bold text-zinc-900">Welcome back</div>
              <div className="mt-2 text-xl font-bold text-zinc-900">
                Sign In to SolveX Account
              </div>
              <Formik
                initialValues={{ initialValues }}
                validationSchema={userLoginValidation}
                onSubmit={handleSubmit}
              >
              <Form className="mt-4">
              <div className="mb-3">
                    <Field
                      type="email"
                      name="email"
                      className="w-full px-4 py-3 bg-white rounded border border-gray-400 text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Email"
                    />
                    <ErrorMessage name="email" component="div" className="text-red-500" />
                  </div>
                  <div className="mb-3">
                    <Field
                      type="password"
                      name="password"
                      className="w-full px-4 py-3 bg-white rounded border border-gray-400 text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your password"
                    />
                    <ErrorMessage name="password" component="div" className="text-red-500" />
                  </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-5 h-5 bg-white rounded border border-gray-600"
                    />
                    <div className="ml-2 text-sm leading-7 text-zinc-900">
                      Remember me
                    </div>
                  </div>
                  <div className="text-sm leading-7 text-blue-500 hover:underline cursor-pointer">
                    Forgot password?
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full px-8 py-3 mt-3 text-sm leading-5 text-white bg-green-700 rounded"
                >
                  Sign In
                </button>
              </Form>
              </Formik>
              <div className="self-center mt-4 text-sm leading-5 text-neutral-300">
                or
              </div>
              <div className="mt-4">
                <button
                  className="w-full px-4 py-2 bg-white rounded border border-gray-400 text-sm leading-5"
                  onClick={handleGoogleLogin}
                >
                  <div className="flex items-center justify-center gap-2">
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/589fe21936d246a88bf3409989c1959e4ca43f7be0847947c16cb51553bbba2c?"
                      className="w-[23px] aspect-square"
                    />
                    <div>Continue with Google</div>
                  </div>
                </button>
                <div className="flex flex-wrap gap-3 mt-3">
                  <button
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white rounded border border-gray-400 flex-1"
                    onClick={handleLinkedInLogin}
                  >
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/15b9d1b7d3a3462c8704392710c1884f11a7b534e97f97db5125527ad34339e8?"
                      className="w-[23px] aspect-square"
                    />
                    <div>LinkedIn</div>
                  </button>
                  <button
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white rounded border border-gray-400 flex-1"
                    onClick={handleGitHubLogin}
                  >
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/973def7342300a36b6dec382e0b89b4c6d6d6e9210ba1d867dfeae2af0440fcf?"
                      className="w-6 aspect-square"
                    />
                    <div>GitHub</div>
                  </button>
                  <button
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white rounded border border-gray-400 flex-1"
                    onClick={handleFacebookLogin}
                  >
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/f83774a3dd6803fb37aba08ce8c27d8f2fa7689111287cf0fd4aab05ead17699?"
                      className="w-[23px] aspect-square"
                    />
                    <div>Facebook</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;