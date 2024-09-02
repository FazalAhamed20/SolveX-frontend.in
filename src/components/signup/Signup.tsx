import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useLogin } from 'react-facebook';
import { Link } from 'react-router-dom';
import OtpPage from './Otp';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { userSignupValidation } from '../../utils/validation/UserSignup';
import { useDispatch } from 'react-redux';
import { GoogleAuth, SignUp } from '../../redux/actions/AuthActions';
import { AppDispatch } from '../../redux/Store';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
const facebookId = String(import.meta.env.VITE_FACEBOOK_ID);
import { ClipLoader } from 'react-spinners';

const Signup: React.FC = () => {
  const [showOtpPage, setShowOtpPage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isGoogle,setIsGoogle]=useState(false)
  const [isFacebook,setIsFacebook]=useState(false)
  const [data, setData] = useState({
    username: '',
    email: '',
    password: '',
    otp: '',
  });

  const dispatch: AppDispatch = useDispatch();
  const { login, isLoading } = useLogin();
  const test = (payload: any) => {
    setData({
      username: payload.name,
      email: payload.email,
      password: payload.password,
      otp: '',
    });
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
     
      test(values);
      const response = await dispatch(SignUp(values.email));
     
      if (response.payload?.success == true) {
        setShowOtpPage(true);
      }
    } finally {
      setLoading(false);
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
    ('Google Signup Error');
    toast.error('Google Signup failed. Please try again.');
  };

  const handleFacebookLogin = async () => {
    setIsFacebook(true)
    const response = await login({
      scope: 'email',
    });

    (response);

    const { accessToken } = response.authResponse;
    

    const result = await axios.get(`${facebookId}${accessToken}`);
   

    await dispatch(GoogleAuth(result.data));
    setIsFacebook(false)
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='flex justify-center items-center bg-white py-10 px-4'>
      {!showOtpPage ? (
        <div className='w-full max-w-4xl'>
          <div className='flex flex-col lg:flex-row gap-5'>
            <div className='flex items-center justify-center w-full lg:w-1/2'>
              <img
                loading='lazy'
                src='https://cdn.builder.io/api/v1/image/assets/TEMP/7595c4513233f6b0b3c670645bca9de8076d0b9dd73193bbdde534838f5ad586?'
                className='w-full aspect-video lg:aspect-auto'
                alt='Signup banner'
              />
            </div>
            <div className='flex flex-col w-full lg:w-1/2'>
              <div className='flex flex-col p-8 bg-white rounded shadow-lg'>
                <div className='text-xl font-bold text-zinc-900'>Join us</div>
                <div className='mt-2 text-xl font-bold text-zinc-900'>
                  Create a SolveX account
                </div>
                <Formik
                  initialValues={{
                    name: '',
                    email: '',
                    password: '',
                    terms: false,
                  }}
                  validationSchema={userSignupValidation}
                  onSubmit={handleSubmit}
                >
                  <Form className='mt-4'>
                    <div className='mb-3'>
                      <Field
                        type='text'
                        name='name'
                        className='w-full px-4 py-3 bg-white rounded border border-gray-400 text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                        placeholder='Full Name'
                        maxLength={30}
                      />
                      <ErrorMessage
                        name='name'
                        component='div'
                        className='text-red-500'
                      />
                    </div>
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
                    <div className='flex items-center mb-3'>
                      <Field
                        type='checkbox'
                        name='terms'
                        className='w-5 h-5 bg-white rounded border border-gray-600'
                      />
                      <div className='ml-2 text-sm leading-7 text-zinc-900'>
                        I agree to SolveX Terms of Service and Privacy Policy.
                      </div>
                    </div>
                    <ErrorMessage
                      name='terms'
                      component='div'
                      className='text-red-500 mb-3'
                    />
                    <button
                      type='submit'
                      disabled={loading}
                      className={`w-full px-8 py-3 mt-3 text-sm leading-5 text-white ${
                        isLoading ? 'bg-green-500' : 'bg-green-700'
                      } rounded`}
                    >
                      {loading ? (
                        <ClipLoader
                          color='#ffffff'
                          loading={loading}
                          size={20}
                        />
                      ) : (
                        'Sign up'
                      )}
                    </button>
                  </Form>
                </Formik>
                <div className='flex items-center justify-between mt-3 flex-wrap'>
                  <div className='text-sm leading-7 text-zinc-900'>
                    Already have an account?
                  </div>
                  <div className='flex items-center justify-center px-4 py-2 mt-2 text-sm font-medium leading-6 text-white bg-green-500 rounded-sm w-full lg:w-auto lg:mt-0 cursor-pointer'>
                    <div>
                      <Link to='/login'>Sign In</Link>
                    </div>
                    <img
                      loading='lazy'
                      src='https://cdn.builder.io/api/v1/image/assets/TEMP/4b4dd86799c516d59b78dc6ab7ce16a924324c921558d4915043f930cf409d4a?'
                      className='w-[11px] aspect-square ml-2'
                      alt='Sign in icon'
                    />
                  </div>
                </div>
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
                      className='w-[200px] flex items-center justify-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-400'
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
      ) : (
        <OtpPage data={data} />
      )}
    </div>
  );
};

export default Signup;
