import React, { useState } from "react";
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
import Loader from "../components/Loader";

function UpdateprofilePage() {
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);

  const handleUpdateData = async (data) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${BASE_URL}/user/update-profile`,
        data,
        {
          headers: getHeaders(), //including header with token
        }
      );
      setLoading(false);
      reset();
      notifyUpdateProfile();
    } catch (error) {
      setLoading(false);
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
      <div className="mt-20 ">
        <form
          className="w-full h-[50vh] flex flex-col items-center justify-center"
          onSubmit={handleSubmit((data) => handleUpdateData(data))}
        >
          <div className=" my-2 flex flex-col justify-center relative items-start">
            {/* username */}
            <label
              htmlFor="username"
              className="font-poppins font-medium pl-2 pb-2"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              {...register("username")}
              className="md:w-[350px] bg-[#f5f5f5] h-10 rounded-lg focus:outline-none pl-5 w-[240px] "
              placeholder="Username"
            />
          </div>

          <div className=" my-2 flex flex-col justify-center relative items-start">
            <label htmlFor="bio" className="font-poppins font-medium pl-2 pb-2">
              Bio
            </label>

            {/* bio */}
            <input
              id="bio"
              type="text"
              {...register("bio")}
              className="md:w-[350px] bg-[#f5f5f5] h-10 rounded-lg focus:outline-none pl-5 w-[240px] "
              placeholder="Bio"
            />
          </div>

          {/* update button */}
          <button
            type="submit"
            className="md:w-[350px] h-10 mt-6 flex justify-center items-center rounded-lg bg-black text-white hover:bg-[#262626] transition duration-500 w-[240px] "
          >
            {loading ? <Loader /> : "Update Profile"}
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
    </div>
  );
}

export default UpdateprofilePage;
