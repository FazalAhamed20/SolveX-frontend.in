import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { userLoginValidation } from '../../../utils/validation/UserLogin';
import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../redux/Store';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { SignIn, GoogleAuth } from '../../../redux/actions/AuthActions';
import { jwtDecode } from 'jwt-decode';
import { useLogin } from 'react-facebook';
import axios from 'axios';
import ForgotPasswordForm from '../forgotPassword/ForgotPassword';
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
const facebookUrl = import.meta.env.VITE_FACEBOOK_ID as string;

const Login: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogle,setIsGoogle]=useState(false)
  const [isFacebook,setIsFacebook]=useState(false)

  const initialValues = {
    email: '',
    password: '',
  };

  const { login } = useLogin();

  const handleSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      await dispatch(SignIn(values));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsGoogle(true)
    if (credentialResponse.credential) {
      const decodedToken: any = jwtDecode(credentialResponse.credential);

      await dispatch(GoogleAuth(decodedToken));
    }
    setIsGoogle(false)
  };

  const handleGoogleFailure = () => {
    
    toast.error('Google Signup failed. Please try again.');
  };

  const handleFacebookLogin = async () => {
    setIsFacebook(true)
    const response = await login({
      scope: 'email',
    });

    const { accessToken } = response.authResponse;

    const result = await axios.get(
      `${facebookUrl}${accessToken}`,
    );
    

    await dispatch(GoogleAuth(result.data));
    setIsFacebook(false)
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='flex justify-center items-center bg-white h-screen'>
      {!showForgotPassword && (
        <div className='w-full max-w-4xl px-4 sm:px-0'>
          <div className='flex flex-col lg:flex-row gap-5'>
            <div className='flex items-center justify-center w-full lg:w-1/2'>
              <img
                loading='lazy'
                src='https://cdn.builder.io/api/v1/image/assets/TEMP/3237df55a7454687bc27b3e9e3d38470613cab1fc208242a27bc7cd9c458e8dc?'
                className='w-full aspect-video lg:aspect-auto'
                alt='Login Image'
              />
            </div>

            <div className='flex flex-col w-full lg:w-1/2'>
              <div className='flex flex-col p-8 bg-white rounded shadow-lg'>
                <div className='text-xl font-bold text-zinc-900'>
                  Welcome back
                </div>
                <div className='mt-2 text-xl font-bold text-zinc-900'>
                  Sign In to SolveX Account
                </div>
                <Formik
                  initialValues={initialValues}
                  validationSchema={userLoginValidation}
                  onSubmit={handleSubmit}
                >
                  <Form className='mt-4'>
                    <div className='mb-3'>
                      <Field
                        type='email'
                        name='email'
                        className='w-full px-4 py-3 bg-white rounded border border-gray-400 text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                        placeholder='Email'
                        maxLength={30}
                      />
                      <ErrorMessage
                        name='email'
                        component='div'
                        className='text-red-500'
                      />
                    </div>
                    <div className='mb-3 relative'>
                      <div className='relative'>
                        <Field
                          type={showPassword ? 'text' : 'password'}
                          name='password'
                          className='w-full px-4 py-3 bg-white rounded border border-gray-400 text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                          placeholder='Your password'
                          maxLength={30}
                        />
                        <div
                          className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer'
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </div>
                      </div>
                      <ErrorMessage
                        name='password'
                        component='div'
                        className='text-red-500 mt-1'
                      />
                    </div>
                    <div className='flex items-center justify-between mb-3'>
                      <div className='flex items-center'>
                        <div className='text-sm leading-7 text-zinc-900'>
                          Don't have an account?
                        </div>
                        <div className='ml-2'>
                          <Link
                            to='/signup'
                            className='text-sm font-medium text-blue-500 hover:underline'
                          >
                            Sign Up
                          </Link>
                        </div>
                      </div>
                      <div
                        className='text-sm leading-7 text-blue-500 hover:underline cursor-pointer'
                        onClick={handleForgotPasswordClick}
                      >
                        Forgot password?
                      </div>
                    </div>
                    <button
                      type='submit'
                      disabled={isLoading}
                      className={`w-full px-8 py-3 mt-3 text-sm leading-5 text-white ${
                        isLoading
                          ? 'bg-green-500'
                          : 'bg-green-700 hover:bg-green-800'
                      } rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50`}
                    >
                      {isLoading ? (
                        <ClipLoader
                          color='#ffffff'
                          loading={isLoading}
                          size={20}
                        />
                      ) : (
                        'Sign In'
                      )}
                    </button>
                  </Form>
                </Formik>
                <div className='self-center mt-4 text-sm leading-5 text-neutral-300'>
                  or
                </div>
                <div className='mt-4'>
                  <div className='mt-4 flex justify-center'>
                  {isGoogle ? (
                      <ClipLoader color='#000000' loading={isGoogle} size={30} />
                    ) : (
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleFailure}
                        useOneTap
                        text='continue_with'
                        shape='circle'
                        width={150}
                      />
                    )}
                  </div>
                  <div className='flex flex-wrap gap-3 mt-3 justify-center'>
                    <button
                      className='w-[200px] flex items-center justify-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-400 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
                      onClick={handleFacebookLogin}
                      disabled={isLoading}
                    >
                       {isFacebook ? (
                        <ClipLoader
                          color='#3b5998'
                          loading={isFacebook}
                          size={20}
                        />
                      ) : (
                        <>
                          <img
                            loading='lazy'
                            src='https://cdn.builder.io/api/v1/image/assets/TEMP/f83774a3dd6803fb37aba08ce8c27d8f2fa7689111287cf0fd4aab05ead17699?'
                            className='w-[23px] aspect-square'
                            alt='Facebook Logo'
                          />
                          <div>Facebook</div>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showForgotPassword && <ForgotPasswordForm />}
    </div>
  );
};

export default Login;
