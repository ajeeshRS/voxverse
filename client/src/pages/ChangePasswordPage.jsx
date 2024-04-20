import React from "react";
import arrowLeftIcon from "../assets/Arrowleft.svg";
import { useNavigate } from "react-router";
import passwordIcon from "../assets/Password.svg";
import { ToastContainer } from "react-toastify";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { BASE_URL } from "../helpers/urls";
import { getHeaders } from "../helpers/getHeaders";
import {
  notifyErrCheckPassword,
  notifyErrUpdatePassword,
  notifyUpdatePassword,
} from "../helpers/toastify";

function ChangePasswordPage() {
  const navigate = useNavigate();

  //   defining schema for zod input validation
  const schema = z
    .object({
      currentPassword: z.string().min(1, "password cannot be empty"),
      password: z
        .string()
        .min(1, "Password cannot be empty")
        .min(6, "Password must be longer than 6 characters"),
      confirm: z.string(),
    })
    // checking the password and confirm password are matching
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
    resolver: zodResolver(schema), //using the schema using zod resolver
  });

  const handleUpdatePassword = async (data) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/user/change-password`,
        data,
        {
          headers: getHeaders(), //including auth header with token
        }
      );
      console.log(response.data);
      // reseting form
      reset();
      notifyUpdatePassword();
    } catch (error) {
      console.log(error);
      //  if the current password is incorrect show the message
      if (error.response.status == 401) {
        notifyErrCheckPassword();
      } else {
        notifyErrUpdatePassword();
      }
    }
  };

  return (
    <div className="h-full">
      <div className="flex items-center pl-10 pt-10">
        <button onClick={() => navigate(-1)}>
          <img src={arrowLeftIcon} alt="left-arrow-btn" />
        </button>
        <h1 className="font-montserrat text-xl font-bold px-2">
          Change password
        </h1>
      </div>

      <form
        className="w-full h-[80vh] flex flex-col items-center justify-center"
        onSubmit={handleSubmit((data) => handleUpdatePassword(data))}
      >
        <div className=" my-2 flex relative items-center">
          <img
            src={passwordIcon}
            alt="user-img"
            className=" w-[25px] h-[25px] cursor-pointer absolute pl-2"
          />
          {/* current password */}
          <input
            type="password"
            {...register("currentPassword")}
            className="md:w-[350px] bg-[#f5f5f5] h-10 rounded-lg focus:outline-none pl-10 w-[240px] "
            placeholder="Current password"
          />
        </div>
        {/* for showing error message */}
        {errors.currentPassword && (
          <p className="text-sm font-poppins text-red-500">
            {errors.currentPassword.message}
          </p>
        )}
        <div className=" my-2 flex relative items-center">
          <img
            src={passwordIcon}
            alt="user-img"
            className=" w-[25px] h-[25px] cursor-pointer absolute pl-2"
          />
          {/* new password */}
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
          {/* confirm new password */}
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
        {/* change button */}
        <button
          type="submit"
          className="md:w-[350px] h-10 mt-6 rounded-lg bg-black text-white hover:bg-[#262626] transition duration-500 w-[240px] "
        >
          Change password
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
    </div>
  );
}

export default ChangePasswordPage;
