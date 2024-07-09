import React  from "react";
import { Formik,Form,Field,ErrorMessage } from "formik";
import { userLoginValidation } from "../../validation/UserLogin";
import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/Store";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { SignIn,GoogleAuth } from "../../redux/actions/AuthActions";
import { jwtDecode } from "jwt-decode";

const Login: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate=useNavigate()
 
const initialValues={
  name:'',email:''
}



const handleSubmit = async (values: any) => {
  ;
  

  const response = await dispatch(SignIn(values));
  console.log("SignUp response:", response);

  if (response.payload && response.payload.success === true) {
    navigate('/home')
   
  } else {
    toast.error(`${response.payload?.message}`);
  }
};

const handleGoogleSuccess = async(credentialResponse: any) => {
  if (credentialResponse.credential) {
    const decodedToken: any = jwtDecode(credentialResponse.credential);
    
    
    const response = await dispatch(GoogleAuth(decodedToken));
    if (response.payload && response.payload.success) {
      toast.success("Google login successful!");
      navigate("/home"); 
    } else {
      toast.error("Google login failed. Please try again.");
    }
  }
};
const handlegoogleFailure = () => {
  console.log("Google Signup Error");
  toast.error("Google Signup failed. Please try again.");
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
          <div className="flex items-center justify-center w-full lg:w-1/2">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/3237df55a7454687bc27b3e9e3d38470613cab1fc208242a27bc7cd9c458e8dc?"
              className="w-full aspect-video lg:aspect-auto"
              alt="Login Image"
            />
          </div>

          <div className="flex flex-col w-full lg:w-1/2">
            <div className="flex flex-col p-8 bg-white rounded shadow-lg">
              <div className="text-xl font-bold text-zinc-900">Welcome back</div>
              <div className="mt-2 text-xl font-bold text-zinc-900">
                Sign In to SolveX Account
              </div>
              <Formik
                initialValues={{initialValues}}
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
              <div className="self-center mt-4 text-sm leading-5 text-neutral-300">or</div>
              <div className="mt-4">
                <div className="mt-4 flex justify-center">
                <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handlegoogleFailure}
                      width="250"
                    />
                </div>
                <div className="flex flex-wrap gap-3 mt-3">
                 
                 
                  <button
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white rounded border border-gray-400 flex-1"
                    onClick={handleFacebookLogin}
                  >
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/f83774a3dd6803fb37aba08ce8c27d8f2fa7689111287cf0fd4aab05ead17699?"
                      className="w-[23px] aspect-square"
                      alt="Facebook Logo"
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