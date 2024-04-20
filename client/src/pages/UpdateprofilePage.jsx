import React from "react";
import arrowLeftIcon from "../assets/Arrowleft.svg";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import axios from "axios";
import { BASE_URL } from "../helpers/urls";
import { getHeaders } from "../helpers/getHeaders";
import { ToastContainer } from "react-toastify";
import {
  notifyErrUpdateProfile,
  notifyUpdateProfile,
} from "../helpers/toastify";

function UpdateprofilePage() {
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();

  const handleUpdateData = async (data) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/user/update-profile`,
        data,
        {
          headers: getHeaders(),//including header with token
        }
      );
      reset();
      notifyUpdateProfile();
    } catch (error) {
      notifyErrUpdateProfile();
      console.log(error);
    }
  };

  return (
    <div>
      <div className="flex items-center pl-10 pt-10">
        <button onClick={() => navigate(-1)}>
          <img src={arrowLeftIcon} alt="left-arrow-btn" />
        </button>
        <h1 className="font-montserrat text-xl font-bold px-2">
          Update Profile
        </h1>
      </div>
      <div className="mt-20 mx-20 flex justify-center">
        <form onSubmit={handleSubmit((data) => handleUpdateData(data))}>
          <div className="flex flex-col items-start">
            {/* username */}
            <label
              htmlFor="username"
              className="font-semibold font-poppins text-sm pl-2 pb-1 "
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="username"
              {...register("username", { required: true })}
              className="md:w-[500px] bg-[#f5f5f5] h-10 rounded-lg focus:outline-none pl-4 w-[240px] pr-5"
            />
          </div>
          <div className="flex flex-col items-start pt-5">
            {/* Bio */}
            <label
              htmlFor="bio"
              className="font-semibold font-poppins text-sm pl-2 pb-1  "
            >
              Bio
            </label>
            <input
              id="bio"
              name="bio"
              type="text"
              placeholder="bio"
              {...register("bio", { required: true })}
              className="md:w-[500px] bg-[#f5f5f5] h-10 rounded-lg focus:outline-none pl-4 w-[240px] pr-5"
            />
          </div>
          <div className="w-[500px] flex justify-end">
            <button
              type="submit"
              className="bg-black text-white text-xs font-poppins px-2 py-2 rounded-full ml-10 hover:bg-white hover:text-black border-black border-2 transition-all duration-300 mt-8"
            >
              Update profile
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
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateprofilePage;
