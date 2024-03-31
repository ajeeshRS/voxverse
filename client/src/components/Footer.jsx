import React from "react";
import facebookIcon from "../assets/Facebook.svg";
import instagramIcon from "../assets/Instagram.svg";
import githubIcon from "../assets/Github.svg";
import xIcon from "../assets/X.svg";

function Footer() {
  return (
    <footer className="w-full sm:h-52 h-auto bg-black flex sm:flex-row gap-5 sm:gap-0 flex-col sm:justify-between sm:items-center items-center  text-white">
      <div className="sm:px-10 px-5 sm:w-2/4 w-4/4 sm:text-start text-center py-5">
        {/* hero text */}
        <p className="text-white sm:text-3xl text-xl font-bold  font-josefin w-full">
          VoxVerse
        </p>
        <p className="font-montserrat sm:text-[12px] text-xs sm:w-3/4 w-full py-2">
          Words have the power to inspire, motivate, and transform. Let your
          blog be a beacon of wisdom, guiding readers through the vast sea of
          knowledge.
        </p>
      </div>
      <div className="px-10 sm:w-2/4 w-full flex flex-col gap-5 items-center justify-center">
        <div className="flex gap-5 justify-center">
          <a href="">
            <img
              src={facebookIcon}
              className="w-[25px] h-[25px]"
              alt="facebook-icon"
            />
          </a>
          <a href="">
            <img
              src={instagramIcon}
              className="w-[25px] h-[25px]"
              alt="instagram-icon"
            />
          </a>
          <a href="">
            <img
              src={githubIcon}
              className="w-[25px] h-[25px]"
              alt="github-icon"
            />
          </a>
          <a href="">
            <img src={xIcon} className="w-[25px] h-[25px]" alt="x-icon" />
          </a>
        </div>
        <p className="py-1 text-sm sm:block hidden">
          2024 all rights reserved.
        </p>
      </div>
      <div
        className="sm:px-10 px-10 mb-2
       sm:w-2/4 w-full flex sm:flex-col sm:items-end items-center gap-1 "
      >
        <input
          type="text"
          placeholder="Type your feedback.."
          className="bg-gray-600 w-3/4 h-10 text-white px-2 border-none  focus:border-none focus:outline-none rounded-md "
        />
        <button className="w-1/4 h-10 rounded-md bg-white text-black hover:bg-black hover:border-2 hover:border-white hover:text-white transition duration-500 ease-in-out my-3  ">
          Send
        </button>
      </div>
      <p className="py-1 mb-2 text-sm sm:hidden block text-center w-full px-10">
        2024 all rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
