import React from "react";
import { Link } from "react-router-dom";
import userIcon from "../assets/User_fill.svg";
import passwordIcon from "../assets/Password.svg";
import googleIcon from "../assets/Google.svg";
import mailIcon from "../assets/Mail.svg";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { BASE_URL } from "../helpers/urls";
import { ToastContainer } from "react-toastify";
import {
  notifyAccountCreation,
  notifyEmailExistError,
} from "../helpers/toastify";

function SignupPage() {
  // Define validation schema using Zod
  const schema = z
    .object({
      userName: z.string(),
      email: z.string().email(),
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
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema), // Use zodResolver to integrate Zod schema with React Hook Form
  });


  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${BASE_URL}/user/signup`, data);

      if (response.status === 201) {
        notifyAccountCreation();
      }
      reset();
    } catch (error) {
      if (error.response.status === 400) {
        notifyEmailExistError();
      }
    }
  };

  // for opening google account login
  const googleAuth = () => {
    window.open(`https://voxverse.netlify.app/auth/google/callback`, "_self");
  };

  return (
    <div className="bg-[#F5F9E9] w-full h-[100vh] flex justify-center items-center">
      <div className="bg-white shadow-lg w-3/4 md:w-2/4  md:h-[85%] h-[65%]  rounded-lg flex flex-col justify-start items-center  ">
        {/* Title */}
        <h2 className="text-[#36453B] text-xl font-bold  font-josefin pt-5">
          VoxVerse
        </h2>

        <div className="flex flex-col justify-center items-center  w-full pt-5 ">
          {/* Sign up form */}
          <form
            onSubmit={handleSubmit((data) => onSubmit(data))}
            className="flex flex-col justify-center items-center"
          >
            {/* Username input */}
            <div className=" my-2 flex relative   items-center">
              <img
                src={userIcon}
                alt="user-img"
                className=" w-[25px] h-[25px] cursor-pointer absolute pl-2"
              />
              <input
                type="text"
                {...register("userName")}
                required
                className="md:w-[350px] bg-[#f5f5f5] h-10 rounded-lg focus:outline-none  pl-10 w-[240px] pr-5 "
                placeholder="Username"
              />
              {errors.userName && (
                <p className="text-sm font-poppins text-red-500">
                  {errors.userName.message}
                </p>
              )}
            </div>
            {/* Email input */}
            <div className=" my-2 flex relative items-center">
              <img
                src={mailIcon}
                alt="user-img"
                className=" w-[25px] h-[25px] cursor-pointer absolute pl-2"
              />
              <input
                type="text"
                {...register("email")}
                className="md:w-[350px] bg-[#f5f5f5] h-10 rounded-lg focus:outline-none  pl-10 w-[240px] pr-5 "
                placeholder="Email"
              />
            </div>
            {errors.email && (
              <p className="text-sm font-poppins text-red-500">
                {errors.email.message}
              </p>
            )}
            {/* Password input */}
            <div className=" my-2 flex relative items-center ">
              <img
                src={passwordIcon}
                alt="password-img"
                className=" w-[25px] h-[25px]  cursor-pointer absolute pl-2"
              />
              <input
                type="password"
                {...register("password")}
                className="md:w-[350px] bg-[#f5f5f5] h-10 rounded-lg focus:outline-none  pl-10 w-[240px] pr-5 "
                placeholder="Password"
              />
            </div>
            {errors.password && (
              <p className="text-sm font-poppins text-red-500">
                {errors.password.message}
              </p>
            )}

            {/* Confirm Password input */}
            <div className=" my-2 flex relative items-center ">
              <img
                src={passwordIcon}
                alt="password-img"
                className=" w-[25px] h-[25px]  cursor-pointer absolute pl-2"
              />
              <input
                type="password"
                {...register("confirm")}
                className="md:w-[350px] bg-[#f5f5f5] h-10 rounded-lg focus:outline-none  pl-10 w-[240px] pr-5 "
                placeholder="Confirm Password"
              />
            </div>
            {errors.confirm && (
              <p className="text-sm font-poppins text-red-500">
                {errors.confirm.message}
              </p>
            )}

            {/* Sign up button */}
            <button
              type="submit"
              className="md:w-[350px] h-10 mt-3 rounded-lg bg-black text-white hover:bg-[#262626] transition duration-500 w-[240px] "
            >
              Sign up
            </button>
            {/* toast container */}
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

          {/* Login link */}
          <p className="text-gray-500 font-sans pt-4 md:text-md text-sm">
            Already have an account ?{" "}
            <span className=" font-medium text-[#262626]">
              <Link to={"/login"}>Log in</Link>
            </span>
          </p>

          {/* Divider */}
          <div className=" flex items-center pt-8 justify-center h-5">
            <div className="bg-gray-400 w-[100px] h-[1px]"></div>
            <div className="mx-3 text-gray-500 text-xs">OR</div>
            <div className="bg-gray-400 w-[100px] h-[1px]"></div>
          </div>

          {/* Sign up with google button */}
          <div className="flex w-full h-[40px] md:mt-8 mt-5 items-center justify-center">
            <button
              className="bg-[#f5f5f5] hover:bg-[rgb(238,238,238)] hover:shadow-sm flex items-center justify-center md:w-1/2 w-[240px] h-full rounded-lg"
              onClick={() => googleAuth()}
            >
              <img
                src={googleIcon}
                alt="google-img"
                className="w-[30px] h-[30px] pr-2"
              />
              <p className="text-gray-600 font-poppins text-md">
                Sign up with Google{" "}
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
