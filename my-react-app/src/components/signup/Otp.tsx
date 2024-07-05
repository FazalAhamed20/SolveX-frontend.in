import React, { useState, useEffect } from "react";

const Otp: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [timer, setTimer] = useState<number>(60); // 60 seconds timer
  const [showResendButton, setShowResendButton] = useState<boolean>(false);

  useEffect(() => {
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

  const handleChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input field
    if (value !== '' && index < otp.length - 1) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput && nextInput.focus();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === 'Backspace' && otp[index] === '' && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput && prevInput.focus();
    }
  };

  const handleResend = () => {
    setOtp(['', '', '', '']);
    setTimer(60);
    setShowResendButton(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">Enter OTP</h2>
        <div className="flex justify-center mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              maxLength={1}
              className="w-12 h-12 text-center mx-1 border border-gray-400 rounded"
            />
          ))}
        </div>
        {showResendButton ? (
          <button
            className="w-full bg-blue-500 text-white py-2 rounded"
            onClick={handleResend}
          >
            Resend OTP
          </button>
        ) : (
          <div className="text-center mb-4">Time left: {timer} seconds</div>
        )}
        {!showResendButton && (
          <button className="w-full bg-blue-500 text-white py-2 rounded">
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default Otp;
