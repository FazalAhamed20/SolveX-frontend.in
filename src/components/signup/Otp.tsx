import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/Store';
import { SignUp, Verify } from '../../redux/actions/AuthActions';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

interface UserData {
  data: {
    username?: string;
    email: string;
    password: string;
    otp: string;
  };
}

const OtpPage: React.FC<UserData> = ({ data }) => {
  const [otp, setOtp] = useState<string>('');
  const [timer, setTimer] = useState<number>(60);
  const [showResendButton, setShowResendButton] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const storedTimer = localStorage.getItem('otpTimer');
    if (storedTimer) {
      setTimer(parseInt(storedTimer));
      if (parseInt(storedTimer) === 0) {
        setShowResendButton(true);
      }
    }

    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer === 1) {
            clearInterval(countdown);
            setShowResendButton(true);
          }
          return prevTimer - 1;
        });
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [timer]);

  const handleOtpChange = (index: number) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      if (inputValue.length <= 1) {
        const otpArray = [...otp];
        otpArray[index] = inputValue;
        setOtp(otpArray.join(''));
        if (inputValue && index < 3) {
          inputRefs.current[index + 1].focus();
        } else if (!inputValue && index > 0) {
          inputRefs.current[index - 1].focus();
        }
      }
    };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otp.length === 4) {
      setIsVerifying(true);
      try {
        data.otp = otp;
        console.log('OTP submitted:', otp);
        const response = await dispatch(Verify(data));
        console.log(response);

        if (response.payload?.status == 201) {
          navigate('/home');
        }
      } catch (error) {
        console.error('OTP verification error:', error);
        toast.error('OTP verification failed. Please try again.');
      } finally {
        setIsVerifying(false);
      }
    } else {
      toast.error('Please enter a 4-digit OTP');
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      setOtp('');
      setTimer(60);
      setShowResendButton(false);
      const response = await dispatch(SignUp(data.email));
      console.log(response);
      toast.success('OTP resent successfully');
    } catch (error) {
      console.error('OTP resend error:', error);
      toast.error('Failed to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className='flex justify-center items-center bg-white py-10 px-4 h-screen'>
      <div className='w-full max-w-md'>
        <div className='flex flex-col items-center bg-white p-8 rounded-lg shadow-lg'>
          <h2 className='text-2xl font-bold text-gray-800 mb-6'>Verify OTP</h2>
          <form onSubmit={handleSubmit} className='w-full'>
            <div className='flex justify-center mb-4'>
              {[...Array(4)].map((_, index) => (
                <input
                  key={index}
                  type='text'
                  className='w-12 h-12 mx-2 bg-gray-200 rounded text-center text-2xl font-bold text-gray-800 focus:outline-none focus:border-blue-500'
                  maxLength={1}
                  ref={ref => (inputRefs.current[index] = ref!)}
                  onChange={handleOtpChange(index)}
                />
              ))}
            </div>
            {showResendButton ? (
              <button
                type='button'
                disabled={isResending}
                className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 rounded focus:outline-none focus:shadow-outline ${
                  isResending ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handleResend}
              >
                {isResending ? (
                  <ClipLoader color='#ffffff' loading={isResending} size={20} />
                ) : (
                  'Resend OTP'
                )}
              </button>
            ) : (
              <div className='text-center mb-4'>Time left: {timer} seconds</div>
            )}
            {!showResendButton && (
              <button
                type='submit'
                disabled={isVerifying}
                className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 rounded focus:outline-none focus:shadow-outline ${
                  isVerifying ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isVerifying ? (
                  <ClipLoader color='#ffffff' loading={isVerifying} size={20} />
                ) : (
                  'Verify OTP'
                )}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default OtpPage;
