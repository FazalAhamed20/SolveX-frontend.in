import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { ForgotPasswordValidation } from '../../utils/validation/ForgotPassword';
import { checkMail, Verify } from '../../redux/actions/AuthActions';
import { AppDispatch, RootState } from '../../redux/Store';
import OtpPasswordModal from '../../utils/modal/OtpPasswordModal';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';

const ForgotPasswordForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const user = useSelector((state: RootState) => state.user.user);
  console.log('user', user);

  const handleSubmit = async (values: any, actions: any) => {
    console.log(values.email);
    console.log(typeof values.email);
    const response = await dispatch(checkMail(values.email));
    console.log(response);

    if (response.payload && response.payload.success === true) {
      setEmail(values.email);
      setIsModalOpen(true);
      setIsFormSubmitted(true);
    }

    actions.resetForm();
    actions.setSubmitting(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsFormSubmitted(false);
  };

  const handleModalSubmit = async (otp: string, newPassword: string) => {
    if (otp.length === 4) {
      const data = {
        username: user.username,
        email: email,
        password: newPassword,
        otp: otp,
      };

      await dispatch(Verify(data));
    } else {
      toast.error('Please enter a 4-digit OTP');
    }
  };

  return (
    <div className='flex justify-center items-center h-screen'>
      {!isFormSubmitted ? (
        <div className='bg-white shadow-md rounded-lg p-6 w-full max-w-md sm:p-8 md:p-10'>
          <h2 className='text-2xl font-bold mb-4 sm:text-3xl md:text-4xl'>
            Forgot Password
          </h2>
          <Formik
            initialValues={{ email: '' }}
            validationSchema={ForgotPasswordValidation}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className='mb-4 sm:mb-6 md:mb-8'>
                  <label className='block text-gray-700 font-bold mb-2 sm:mb-3 md:mb-4'>
                    Email
                  </label>
                  <Field
                    type='email'
                    id='email'
                    name='email'
                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline sm:py-3 md:py-4'
                    placeholder='Enter your email'
                  />
                  <ErrorMessage
                    name='email'
                    component='div'
                    className='text-red-500 font-bold mt-1'
                  />
                </div>
                <button
                  type='submit'
                  className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline sm:py-3 md:py-4 sm:px-6 md:px-8'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Reset Password'}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      ) : (
        <OtpPasswordModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handleModalSubmit}
          email={email} // Pass the email as a prop to the modal
        />
      )}
    </div>
  );
};

export default ForgotPasswordForm;
