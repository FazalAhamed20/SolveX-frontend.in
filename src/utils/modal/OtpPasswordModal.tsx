import React, { useState, useEffect, useRef } from "react";
import { Formik, Form, Field } from "formik";
import { validationSchema } from "../validation/OtpPassword";
import Modal from "react-modal";
import { ResendOtp } from "../../redux/actions/AuthActions";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/Store";

type OtpPasswordModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (otp: string, newPassword: string) => void;
  email: string;
};

const OtpPasswordModal: React.FC<OtpPasswordModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  email,
}) => {
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [otpError, setOtpError] = useState("");
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isOpen && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isOpen, timer]);

  const handleOtpKeyUp = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      if (index > 0) {
        otpInputRefs.current[index - 1]?.focus();
      }
    } else if (/[0-9]/.test(e.key)) {
      if (index < 3) {
        otpInputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    if (value.length <= 1) {
      const updatedOtpDigits = [...otpDigits];
      updatedOtpDigits[index] = value;
      setOtpDigits(updatedOtpDigits);
      setOtpError("");
    }
  };

  const handleSubmit = (values: { newPassword: string }) => {
    const otp = otpDigits.join("");
    if (otp.length !== 4) {
      setOtpError("OTP should be 4 digits");
      return;
    }
    onSubmit(otp, values.newPassword);
    setOtpDigits(["", "", "", ""]);
  };

  const handleResendOtp = async () => {
    const response = await dispatch(ResendOtp(email));
    console.log(response);

    setTimer(60);
    setOtpDigits(["", "", "", ""]);
    setOtpError("");
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
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "white",
          border: "none",
          padding: "0",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        },
        overlay: {
          position: "fixed",
          top: "0",
          left: "0",
          right: "0",
          bottom: "0",
          background: "rgba(0, 0, 0, 0.5)",
          zIndex: "1000",
        },
      }}
    >
      <div className="modal-content bg-white shadow-md rounded-lg p-6 w-full max-w-md sm:p-8 md:p-10">
        <h2 className="text-2xl font-bold mb-4 sm:text-3xl md:text-4xl">
          Enter OTP and New Password
        </h2>
        <Formik
          initialValues={{ newPassword: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <div className="mb-4 sm:mb-6 md:mb-8 flex justify-center">
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    id={`otp-${index}`}
                    name={`otp-${index}`}
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyUp={(e) => handleOtpKeyUp(e, index)}
                    className={`otp-box text-center mx-2 w-12 h-12 border rounded ${
                      otpError ? "border-red-500" : "border-gray-300"
                    }`}
                    maxLength={1}
                    ref={(el) => (otpInputRefs.current[index] = el)}
                    autoFocus={index === 0}
                  />
                ))}
              </div>
              {otpError && (
                <p className="text-red-500 mb-4 text-center">{otpError}</p>
              )}
              <p className="text-sm text-gray-600 mb-4 text-center">
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
                <Field
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline sm:py-3 md:py-4"
                />
                {errors.newPassword && touched.newPassword && (
                  <div className="text-red-500 mt-2">{errors.newPassword}</div>
                )}
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
                  Close 
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};

export default OtpPasswordModal;
