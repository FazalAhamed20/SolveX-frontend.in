import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { LoginButton } from "react-facebook";
import { useNavigate } from "react-router-dom";
import OtpPage from "./Otp";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { userSignupValidation } from "../../validation/UserSignup";
import { useDispatch } from "react-redux";
import { GoogleAuth, SignUp } from "../../redux/actions/AuthActions";
import { AppDispatch } from "../../redux/Store";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { FaFacebook } from "react-icons/fa";
import axios from "axios";

const Signup: React.FC = () => {
  const [showOtpPage, setShowOtpPage] = useState(false);
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    otp: "",
  });
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const test = (payload: any) => {
    setData({
      username: payload.name,
      email: payload.email,
      password: payload.password,
      otp: "",
    });
  };

  const handleSubmit = async (values: any) => {
    console.log("Form values:", values);
    test(values);

    const response = await dispatch(SignUp(values.email));
    console.log("SignUp response:", response.payload?.success);

    if (response.payload && response.payload?.success === true) {
      setShowOtpPage(true);
    } else {
      toast.error(`${response.payload?.message}`);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
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

  const handleGoogleFailure = () => {
    console.log("Google Signup Error");
    toast.error("Google Signup failed. Please try again.");
  };

  const handleFacebookResponse = async (response: any) => {
    const { accessToken, userID } = response.authResponse;
    console.log("Access Token:", accessToken);
    console.log("User ID:", userID);

    const result = await axios.get(
      `https://graph.facebook.com/v12.0/me?fields=id,name,email&access_token=${accessToken}`
    );
    console.log("Facebook User Data:", result.data);

    const answer = await dispatch(GoogleAuth(result.data));
    if (answer.payload && answer.payload.success) {
      toast.success("Google login successful!");
      navigate("/home");
    } else {
      toast.error("Facebook login failed. Please try again.");
    }
  };

  const handleFacebookError = (error: any) => {
    console.log("Facebook login error:", error);
    toast.error("Facebook login failed. Please try again.");
  };

  return (
    <div className="flex justify-center items-center bg-white py-10 px-4">
      {!showOtpPage ? (
        <div className="w-full max-w-4xl">
          <div className="flex flex-col lg:flex-row gap-5">
            <div className="flex items-center justify-center w-full lg:w-1/2">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/7595c4513233f6b0b3c670645bca9de8076d0b9dd73193bbdde534838f5ad586?"
                className="w-full aspect-video lg:aspect-auto"
                alt="Signup banner"
              />
            </div>
            <div className="flex flex-col w-full lg:w-1/2">
              <div className="flex flex-col p-8 bg-white rounded shadow-lg">
                <div className="text-xl font-bold text-zinc-900">Join us</div>
                <div className="mt-2 text-xl font-bold text-zinc-900">
                  Create a SolveX account
                </div>
                <Formik
                  initialValues={{
                    name: "",
                    email: "",
                    password: "",
                    terms: false,
                  }}
                  validationSchema={userSignupValidation}
                  onSubmit={handleSubmit}
                >
                  <Form className="mt-4">
                    <div className="mb-3">
                      <Field
                        type="text"
                        name="name"
                        className="w-full px-4 py-3 bg-white rounded border border-gray-400 text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Full Name"
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-red-500"
                      />
                    </div>

                    <div className="mb-3">
                      <Field
                        type="email"
                        name="email"
                        className="w-full px-4 py-3 bg-white rounded border border-gray-400 text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Email"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500"
                      />
                    </div>
                    <div className="mb-3">
                      <Field
                        type="password"
                        name="password"
                        className="w-full px-4 py-3 bg-white rounded border border-gray-400 text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Your password"
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-red-500"
                      />
                    </div>
                    <div className="flex items-center mb-3">
                      <Field
                        type="checkbox"
                        name="terms"
                        className="w-5 h-5 bg-white rounded border border-gray-600"
                      />
                      <div className="ml-2 text-sm leading-7 text-zinc-900">
                        I agree to SolveX Terms of Service and Privacy Policy.
                      </div>
                    </div>
                    <ErrorMessage
                      name="terms"
                      component="div"
                      className="text-red-500 mb-3"
                    />
                    <button
                      type="submit"
                      className="w-full px-8 py-3 mt-3 text-sm leading-5 text-white bg-green-700 rounded"
                    >
                      Sign up
                    </button>
                  </Form>
                </Formik>
                <div className="flex items-center justify-between mt-3 flex-wrap">
                  <div className="text-sm leading-7 text-zinc-900">
                    Already have an account?
                  </div>
                  <div
                    onClick={() => navigate("/login")}
                    className="flex items-center justify-center px-4 py-2 mt-2 text-sm font-medium leading-6 text-white bg-green-500 rounded-sm w-full lg:w-auto lg:mt-0 cursor-pointer"
                  >
                    <div>Sign In</div>
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/4b4dd86799c516d59b78dc6ab7ce16a924324c921558d4915043f930cf409d4a?"
                      className="w-[11px] aspect-square ml-2"
                      alt="Sign in icon"
                    />
                  </div>
                </div>
                <div className="self-center mt-4 text-sm leading-5 text-neutral-300">
                  or
                </div>
                <div className="mt-4 flex flex-col md:flex-row justify-center space-y-3 md:space-y-0 md:space-x-3">
  <GoogleLogin
    onSuccess={handleGoogleSuccess}
    onError={handleGoogleFailure}
    className="w-full md:w-auto px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
  />
  <LoginButton
    scope="email"
    onSuccess={handleFacebookResponse}
    onError={handleFacebookError}
    className="flex items-center justify-center w-full md:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
  >
    <FaFacebook className="w-6 h-6 mr-1" />
    <span>Facebook</span>
  </LoginButton>
</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <OtpPage data={data} />
      )}
    </div>
  );
};

export default Signup;
