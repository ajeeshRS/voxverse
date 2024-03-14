import React, { useState } from "react";
import SearchSvg from "../assets/Search.svg";
import Hamburger from "../assets/Sort.svg";
import article from "../assets/Order_fill.svg";
import login from "../assets/Sign_in_squre_fill.svg";
import userAdd from "../assets/User_add_alt_fill.svg";
import group from "../assets/Group.svg";

import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggle } from "../state/slices/ToggleSlice";
function NavBar() {

  const isClicked = useSelector((state)=>state.toggleMenu.value)

  const dispatch = useDispatch()

  return (
    // Navbar
    <nav className="w-full z-[10] bg-white h-20 shadow-md fixed">
      <div className="h-20 flex flex-row justify-between items-center">
        <div className="flex items-center justify-around md:w-[35%] w-24 h-20">
          <img
            src={Hamburger}
            alt="hamburger-menu"
            className="md:hidden w-[45px] h-[45px] pb-2 cursor-pointer "
            onClick={() => {
              dispatch(toggle());
              console.log("clicked");
            }}
          />
          <p className="text-[#36453B] text-3xl font-bold  font-josefin w-10">
            VoxVerse
          </p>
          <div className=" flex-row w-48 text-gray-500 justify-between ml-10 font-montserrat md:flex hidden ">
            <p className="px-1 font-medium hover:text-black transition duration-300 cursor-pointer">
              <Link to="/articles">Articles</Link>
            </p>
            <p className="px-1 font-medium hover:text-black transition duration-300 cursor-pointer">
              <Link to="/signup">Be a writer</Link>
            </p>
          </div>
        </div>
        <div className="flex md:justify-between justify-around items-center  h-20 md:relative">
          <img
            src={SearchSvg}
            alt=""
            className="md:absolute w-[35px] h-[35px] pl-1 cursor-pointer"
          />
          <input
            type="text"
            className="w-50 bg-[#f5f5f5] h-10 rounded-full focus:outline-none pl-9 md:block hidden"
            placeholder="Search..."
          />

          <div className="flex justify-around items-center md:w-48 h-20 mx-4 ">
            <button className="w-24 h-10 bg-black text-white rounded-full  hover:bg-[#262626]  transition shadow-md  duration-500 ease-in-out md:block hidden ">
              <Link to={'/login'}>
              Log in
              </Link>
            </button>
          </div>
        </div>
      </div>
      {isClicked && (
        <div
          className={`md:hidden fixed inset-y-0 z-10 flex flex-col items-start bg-black w-[80%] px-4 py-6 space-y-4 mt-20 shadow-md `}
        >
          <li className="py-2 w-full list-none text-white text-2xl hover:text-gray-300 font-montserrat font-semibold flex items-center px-1">
            <img src={article} alt="article-logo" className="pr-5 " />
            <Link to="/articles">Articles</Link>
          </li>
          <li className="py-2 w-full list-none text-white text-2xl hover:text-gray-300 font-montserrat font-semibold flex items-center px-1">
            <img src={userAdd} alt="user-add-logo" className="pr-5" />
            <Link to="/signup">Be a writer</Link>
          </li>
          <li className="py-2 w-full list-none text-white text-2xl hover:text-gray-300 font-montserrat font-semibold flex items-center px-1">
            <img src={group} alt="about-logo" className="pr-5" />
            <Link to="/about">About us</Link>
          </li>
          <li className="py-2 w-full list-none text-white text-2xl hover:text-gray-300 font-montserrat font-semibold flex items-center px-1">
            <img src={login} alt="login-logo" className="pr-5" />
            <Link to="/log">Log in</Link>
          </li>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
