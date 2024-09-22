import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { ToastContainer } from "react-toastify";
import { z } from "zod";
import emailIcon from "../assets/Mail.svg";
import leftArrow from "../assets/Arrowleft.svg";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../helpers/urls";
import { notifyEmailError, notifyOtpSent } from "../helpers/toastify";
import { useDispatch } from "react-redux";
import { toggle } from "../state/slices/OtpSlice";

function PasswordResetPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Define validation schema using Zod
  const schema = z.object({
    email: z.string().email(),
  });
  // Useform components
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema), // Use zodResolver to integrate Zod schema with React Hook Form
  });

  const handleGetOtp = async (data) => {
    try {
      // sending data
      const response = await axios.post(
        `${BASE_URL}/auth/forgot-password`,
        data
      );
      // if otp has sent show toast message
      if (response.status == 200) {
        dispatch(toggle());
        notifyOtpSent();
      }
      // navigate to next page after 3sec
      setTimeout(() => {
        navigate("/verify-otp", { state: { email: data.email } });
      }, 3000);
    } catch (err) {
      if (err.response.status == 404) {
        notifyEmailError(err.response.data);
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
          Forgot Password?
        </p>

        <div className="flex flex-col justify-center items-center w-full pt-5 ">
          <form
            className="flex flex-col justify-center items-center"
            onSubmit={handleSubmit((data) => handleGetOtp(data))}
          >
            {/* Email input */}
            <div className=" my-2 flex relative items-center">
              <img
                src={emailIcon}
                alt="user-img"
                className=" w-[25px] h-[25px] cursor-pointer absolute pl-2"
              />
              <input
                type="text"
                {...register("email")}
                className="md:w-[350px] bg-[#f5f5f5] h-10 rounded-lg focus:outline-none pl-10 w-[240px] "
                placeholder="Email"
              />
            </div>
            {errors.email && (
              <p className="text-sm font-poppins text-red-500">
                {errors.email.message}
              </p>
            )}

            {/* forget button */}
            <button
              type="submit"
              className="md:w-[350px] h-10 mt-3 rounded-lg bg-black text-white hover:bg-[#262626] transition duration-500 w-[240px] "
            >
              Get OTP
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

          <p className="text-gray-500 font-sans pt-4 md:text-md text-sm flex items-center pr-6 ">
            <img
              src={leftArrow}
              alt="left-arrow"
              className=" w-[25px] h-[25px] cursor-pointer  pr-2"
            />
            <span className=" font-medium text-[#262626]">
              <Link to="/login">Back to Login</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default PasswordResetPage;
