import React from "react";
import { useRef, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import passwordIcon from "../assets/Password.svg";
import axios from "axios";
import { BASE_URL } from "../helpers/urls";
import {
  notifyPasswordUpdation,
  notifyPasswordUpdationErr,
} from "../helpers/toastify";
function NewPassword() {
  const location = useLocation();
  const email = location.state.email;

  // Define validation schema using Zod
  const schema = z
    .object({
      password: z
        .string()
        .min(1, "Password cannot be empty")
        .min(6, "Password must be longer than 6 characters"),
      confirm: z.string(),
    })
    .refine((data) => data.password === data.confirm, {
      message: "Passwords do not match",
      path: ["confirm"],
    });

  // Useform components
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema), // Use zodResolver to integrate Zod schema with React Hook Form
  });

  const handleConfirm = async (formData) => {
    try {
      // Creating a data object for sending it to the server
      const data = {
        email: email,
        password: formData.password,
      };
      // Sending the request to update the password with the data
      const response = await axios.put(
        `${BASE_URL}/auth/reset-password`,
        data
      );
      // On success show toast message
      if (response.status == 200) {
        notifyPasswordUpdation(response.data);
      }
      // resets the forms
      reset();
    } catch (err) {
      console.log(err);
      // On error show error toast message
      if (err.response.status == 400) {
        notifyPasswordUpdationErr(err.response.data);
      }
    }
  };

  return (
    <div className="bg-[#F5F9E9] w-full h-[100vh] flex justify-center items-center">
      <div
        className="bg-white shadow-lg w-3/4 md:w-2/4  md:h-[80%] h-[65%] pb-20
        rounded-lg flex flex-col justify-center items-center  "
      >
        {/* Title */}
        <h2 className="text-[#36453B] text-xl font-bold  font-josefin pt-7">
          VoxVerse
        </h2>
        {/* Forgot text */}
        <p className="font-semibold text-lg text-[#262626] font-poppins pt-5">
          Set New Password
        </p>

        <div className="flex flex-col justify-center items-center w-full pt-4 ">
          <form
            className="flex flex-col justify-center items-center"
            onSubmit={handleSubmit((data) => handleConfirm(data))}
          >
            <div className=" my-2 flex relative items-center">
              <img
                src={passwordIcon}
                alt="user-img"
                className=" w-[25px] h-[25px] cursor-pointer absolute pl-2"
              />
              <input
                type="password"
                {...register("password")}
                className="md:w-[350px] bg-[#f5f5f5] h-10 rounded-lg focus:outline-none pl-10 w-[240px] "
                placeholder="New password"
              />
            </div>
            {errors.password && (
              <p className="text-sm font-poppins text-red-500">
                {errors.password.message}
              </p>
            )}
            <div className=" my-2 flex relative items-center">
              <img
                src={passwordIcon}
                alt="user-img"
                className=" w-[25px] h-[25px] cursor-pointer absolute pl-2"
              />
              <input
                type="password"
                {...register("confirm")}
                className="md:w-[350px] bg-[#f5f5f5] h-10 rounded-lg focus:outline-none pl-10 w-[240px] "
                placeholder="Confirm new password"
              />
            </div>
            {errors.confirm && (
              <p className="text-sm font-poppins text-red-500">
                {errors.confirm.message}
              </p>
            )}
            {/* confirm button */}
            <button
              type="submit"
              className="md:w-[350px] h-10 mt-6 rounded-lg bg-black text-white hover:bg-[#262626] transition duration-500 w-[240px] "
            >
              Confirm
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
            <span className=" font-medium text-[#262626]">
              <Link to={"/login"}>Back to Login</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default NewPassword;
