import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';

type OtpPasswordModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (otp: string, newPassword: string) => void;
};

const OtpPasswordModal: React.FC<OtpPasswordModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']); // Array to hold OTP digits
  const [newPassword, setNewPassword] = useState('');
  const [timer, setTimer] = useState(60); // Initial timer value in seconds
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]); // Ref for OTP input elements

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setTimer(60); // Reset timer when modal closes or reaches 0
    }

    return () => clearInterval(interval);
  }, [isOpen, timer]);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    if (value.length <= 1) {
      const updatedOtpDigits = [...otpDigits];
      updatedOtpDigits[index] = value;
      setOtpDigits(updatedOtpDigits);
      console.log('Current OTP:', updatedOtpDigits.join(''));
    }

    // Focus on next input if available
    if (otpInputRefs.current[index + 1] && value.length > 0) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNewPassword(value);
    console.log('Current Password:', value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otp = otpDigits.join(''); 
    onSubmit(otp, newPassword);
    setOtpDigits(['', '', '', '']); 
    setNewPassword('');
  };

  const handleResendOtp = () => {
   
    setTimer(60); 
    setOtpDigits(['', '', '', '']); 
    otpInputRefs.current[0]?.focus(); 
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="OTP and New Password Modal"
      className="modal"
      overlayClassName="overlay"
      style={{
        content: {
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          background: 'transparent',
          border: 'none',
          padding: '0',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
        overlay: {
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: '1000',
        },
      }}
    >
      <div className="modal-content bg-white shadow-md rounded-lg p-6 w-full max-w-md sm:p-8 md:p-10">
        <h2 className="text-2xl font-bold mb-4 sm:text-3xl md:text-4xl">
          Enter OTP and New Password
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 sm:mb-6 md:mb-8 flex justify-center">
            {otpDigits.map((digit, index) => (
              <input
                key={index}
                type="text"
                id={`otp-${index}`}
                name={`otp-${index}`}
                value={digit}
                onChange={(e) => handleOtpChange(e, index)}
                className="otp-box text-center mx-2 w-12 h-12 border rounded"
                maxLength={1}
                ref={(el) => (otpInputRefs.current[index] = el)}
                autoFocus={index === 0}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Enter the OTP received (expires in {timer} seconds)
          </p>
          {timer === 0 && (
            <button
              type="button"
              className="text-blue-500 hover:underline focus:outline-none mb-4"
              onClick={handleResendOtp}
            >
              Resend OTP
            </button>
          )}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <label
              htmlFor="newPassword"
              className="block text-gray-700 font-bold mb-2 sm:mb-3 md:mb-4"
            >
              New Password:
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={handlePasswordChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline sm:py-3 md:py-4"
              required
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline sm:py-3 md:py-4 sm:px-6 md:px-8"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline sm:py-3 md:py-4 sm:px-6 md:px-8"
            >
              Close Modal
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default OtpPasswordModal;
