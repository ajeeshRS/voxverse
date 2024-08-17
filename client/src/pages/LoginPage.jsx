import React from "react";
import { Link, useNavigate } from "react-router-dom";
import emailIcon from "../assets/Mail.svg";
import passwordIcon from "../assets/Password.svg";
import googleIcon from "../assets/Google.svg";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BASE_URL } from "../helpers/urls";
import { ToastContainer } from "react-toastify";
import { notifyInvalidCredentials } from "../helpers/toastify";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getHeaders } from "../helpers/getHeaders";
import { setUser } from "../state/slices/UserStateSlice";

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  // Define validation schema using Zod
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(1, "Password cannot be empty"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema), // Use zodResolver to integrate Zod schema with React Hook Form
  });

  const googleAuth = () => {
    // Opening the google authentication page
    window.open(`${BASE_URL}/auth/google/callback`, "_self");
  };

  const handleLogin = async (data) => {
    try {
      const response = await axios.post(`${BASE_URL}/user/login`, data);
      localStorage.setItem("token", response.data.accessToken);

      const userResponse = await axios.get(`${BASE_URL}/user/get`,{headers:getHeaders()});
      dispatch(setUser(userResponse.data));

      navigate("/");
    } catch (err) {
      console.log(err);
      if(err.response.status == 401){
        notifyInvalidCredentials()
      }
    }
  };

  return (
    <div className="bg-[#F5F9E9] w-full h-[100vh] flex justify-center items-center">
      <div className="bg-white shadow-lg w-3/4 md:w-2/4  md:h-[80%] h-[65%]  rounded-lg flex flex-col justify-start items-center  ">
        {/* Title */}
        <h2 className="text-[#36453B] text-xl font-bold  font-josefin pt-7">
          VoxVerse
        </h2>
        {/* Welcome text */}
        <p className="font-bold text-xl text-[#262626] font-poppins pt-5">
          Welcome Back
        </p>

        {/* Email input */}
        <div className="flex flex-col justify-center items-center w-full pt-5 ">
          <form
            className="flex flex-col justify-center items-center"
            onSubmit={handleSubmit((data) => handleLogin(data))}
          >
            <div className=" my-2 flex relative items-center">
              <img
                src={emailIcon}
                alt="user-img"
                className=" w-[25px] h-[25px] cursor-pointer absolute pl-2"
              />
              <input
                type="text"
                {...register("email")}
                className="md:w-[350px] bg-[#f5f5f5] h-10 rounded-lg focus:outline-none pl-10 w-[240px]  pr-5"
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
                className="md:w-[350px] bg-[#f5f5f5] h-10 rounded-lg focus:outline-none pl-10 w-[240px] pr-5"
                placeholder="Password"
              />
            </div>
            {errors.password && (
              <p className="text-sm font-poppins text-red-500">
                {errors.password.message}
              </p>
            )}
            {/* Forgot password link */}
            <div className="flex w-full justify-end pr-2">
              <Link to={"/forgot-password"}>
                <p className="text-sm font-sans underline text-gray-600 w-full  ">
                  Forgot password ?
                </p>
              </Link>
            </div>
            {/* Login in button */}
            <button
              type="submit"
              className="md:w-[350px] h-10 mt-3 rounded-lg bg-black text-white hover:bg-[#262626] transition duration-500 w-[240px] "
            >
              Log in
            </button>
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
          {/* Signup link */}
          <p className="text-gray-500 font-sans pt-4 md:text-md text-sm">
            Don&apos;t have an account yet?{" "}
            <span className=" font-medium text-[#262626]">
              <Link to={"/signup"}>Sign up</Link>
            </span>
          </p>
          {/* Divider */}
          <div className=" hidden items-center md:pt-8 pt-10 justify-center h-5">
            <div className="bg-gray-400 w-[100px] h-[1px]"></div>
            <div className="mx-3 text-gray-500">OR</div>
            <div className="bg-gray-400 w-[100px] h-[1px]"></div>
          </div>
          {/* Login with google button */}
          <div className="hidden  w-full h-[40px] md:mt-8 mt-10 items-center justify-center">
            <button
              className="bg-[#f5f5f5] hover:bg-[#eeeeee] hover:shadow-sm flex items-center justify-center md:w-1/2 w-[240px] h-full rounded-lg"
              onClick={() => googleAuth()}
            >
              <img
                src={googleIcon}
                alt="google-img"
                className="w-[30px] h-[30px] pr-2"
              />
              <p className="text-gray-600 font-poppins text-md">
                Log in with Google{" "}
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
