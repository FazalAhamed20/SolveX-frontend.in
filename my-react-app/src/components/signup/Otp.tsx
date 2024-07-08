import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/Store";
import { SignUp, Verify } from "../../redux/actions/AuthActions";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface UserData {
  data: {
    username: string;
    email: string;
    password: string;
    otp: string;
  };
}

const OtpPage: React.FC<UserData> = ({ data }) => {
  const [otp, setOtp] = useState<string>("");
  const [timer, setTimer] = useState<number>(60);
  const [showResendButton, setShowResendButton] = useState<boolean>(false);
  const inputRefs = useRef<HTMLInputElement[]>([]);
  
const navigate=useNavigate()
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const storedTimer = localStorage.getItem("otpTimer");
    if (storedTimer) {
      setTimer(parseInt(storedTimer));
      if (parseInt(storedTimer) === 0) {
        setShowResendButton(true);
      }
    }

    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => {
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
        setOtp(otpArray.join(""));
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
      data.otp = otp;

      console.log("OTP submitted:", otp);
      const response = await dispatch(Verify(data));

      if (response.payload?.status == 201) {
        navigate('/home')
       
      }
    } else {
      
      toast.error("Please enter a 4-digit OTP")
    }
  };

  const handleResend = async () => {
    setOtp("");
    setTimer(60);
    setShowResendButton(false);
    const response = await dispatch(SignUp(data.email));

    console.log(response);
  };

  return (
    <div className="flex justify-center items-center bg-white py-10 px-4 h-screen">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Verify OTP</h2>
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex justify-center mb-4">
              {[...Array(4)].map((_, index) => (
                <input
                  key={index}
                  type="text"
                  className="w-12 h-12 mx-2 bg-gray-200 rounded text-center text-2xl font-bold text-gray-800 focus:outline-none focus:border-blue-500"
                  maxLength={1}
                  ref={(ref) => (inputRefs.current[index] = ref!)}
                  onChange={handleOtpChange(index)}
                />
              ))}
            </div>
            {showResendButton ? (
              <button
                type="button"
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 rounded focus:outline-none focus:shadow-outline"
                onClick={handleResend}
              >
                Resend OTP
              </button>
            ) : (
              <div className="text-center mb-4">Time left: {timer} seconds</div>
            )}
            {!showResendButton && (
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 rounded focus:outline-none focus:shadow-outline"
              >
                Verify OTP
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default OtpPage;
