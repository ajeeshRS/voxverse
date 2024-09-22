import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { BASE_URL } from "../helpers/urls";
import {
  notifyOtpResent,
  notifyOtpVerified,
  notifyOtpVerifyError,
} from "../helpers/toastify";

function VerifyOtp({ length = 5 }) {
  const location = useLocation();
  const { email } = location.state;
  const navigate = useNavigate();


  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const onOtpSubmit = (otp) => {
    console.log("login success", otp);
  };

  const handleChange = (index, e) => {
    e.preventDefault();
    const value = e.target.value;

    if (isNaN(value)) return;
    const newOtp = [...otp];
    // Allow only one input
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // submit trigger
    const combinedOtp = newOtp.join("");
    if (combinedOtp.length === length) onOtpSubmit(combinedOtp);

    // Move to next input if current field is filled
    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleClick = (index) => {
    inputRefs.current[index].setSelectionRange(1, 1);

    // optional
    if (index > 0 && !otp[index - 1]) {
      inputRefs.current[otp.indexOf("")].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      // Move focus to the previous input field on backspace
      inputRefs.current[index - 1].focus();
    }
  };

  // Resend otp
  const resendOtp = async () => {
    try {
      // sending request to resend the otp
      const response = await axios.post(`${BASE_URL}/auth/resend-otp`, {
        email,
      });
      // On success resent show toast message
      if (response.status == 200) {
        notifyOtpResent(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const combinedOtp = otp.join("");
      const details = {
        email: email,
        otp: combinedOtp,
      };
      // sending request to verify the otp
      const response = await axios.post(`${BASE_URL}/auth/verify-otp`, details);
      if (response.status == 200) {
        notifyOtpVerified(response.data);
      }
      // navigate to next page after 3sec
      setTimeout(() => {
        navigate("/reset-password", { state: { email: email } });
      }, 3000);
    } catch (error) {
      console.log(error);
      // On error show error toast message
      if (error.response.status == 404) {
        notifyOtpVerifyError(error.response.data);
      }
    }
  };

  return (
    <div className="bg-[#F3F7FA] w-full h-[100vh] flex justify-center items-center">
      <div
        className="bg-white shadow-lg w-5/6 md:w-2/4 h-fit p-10
        rounded-xl flex flex-col justify-center items-center  "
      >
        {/* Title */}
        <h2 className="text-[#36453B] text-3xl font-bold  font-josefin">
          VoxVerse
        </h2>
        {/* Forgot text */}
        <p className="font-semibold text-lg text-[#262626] font-poppins pt-5">
          Enter OTP
        </p>

        <div className="flex flex-col justify-center items-center w-full pt-5 ">
          <form
            className="flex flex-col justify-center items-center"
            onSubmit={(e) => onFormSubmit(e)}
          >
            <div>
              {otp.map((value, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={value}
                  ref={(input) => (inputRefs.current[index] = input)}
                  onChange={(e) => handleChange(index, e)}
                  onClick={() => handleClick(index)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-[40px] h-[40px] bg-gray-200 md:mx-4 mx-1 rounded-md focus:outline-none md:pl-4"
                />
              ))}
            </div>
            {/* verify button */}
            <button
              type="submit"
              className="md:w-[350px] h-10 mt-6 rounded-lg bg-black text-white hover:bg-[#262626] transition duration-500 w-[240px] "
            >
              Verify
            </button>
            {/* Toast message container */}
            <ToastContainer
              position="top-center"
              autoClose={3000}
              hideProgressBar={true}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              theme="light"
            />
          </form>
          {/* Back to login link */}

          <p className="text-gray-500 font-sans pt-4 md:text-md text-sm flex items-center ">
            Didn&apos;t get your OTP ?
            <span
              className=" font-medium text-[#262626] pl-2 cursor-pointer"
              onClick={resendOtp}
            >
              Resend
            </span>
          </p>
          <p className="text-gray-500 font-sans pt-4 md:text-md text-sm flex items-center ">
            <span className=" font-medium text-[#262626]">Back to Login</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default VerifyOtp;
