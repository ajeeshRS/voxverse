import React, { useEffect } from "react";
import arrowLeftIcon from "../assets/Arrowleft.svg";
import fileIcon from "../assets/File.svg";
import bookmarkIcon from "../assets/Bookmark.svg";
import logoutIcon from "../assets/signOut.svg";

import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../state/slices/UserStateSlice";
import axios from "axios";
import { BASE_URL } from "../helpers/urls";
import { getHeaders } from "../helpers/getHeaders";
import editIcon from "../assets/Edit.svg";
import passwordIcon from "../assets/Password.svg";
function UserProfilePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // state for user existence
  const user = useSelector((state) => state.userState.user);
  console.log(user);
  // setting the user name to a variable
  const userName = user.username;
  const bio = user.bio;
  const googleId = user.google_id;

  let userNameArray;
  let userFirstLetter;
  // if username is there then split and
  //  get the first letter and make that letter uppercase
  if (userName) {
    userNameArray = userName.split("");
    userFirstLetter = userNameArray[0].toUpperCase();
  }

  useEffect(() => {
    // function to fetch user
    const fetchUser = async () => {
      try {
        // Fetch user with token
        const tokenResponse = await axios.get(`${BASE_URL}/user/get`, {
          headers: getHeaders(),
        });
        dispatch(setUser(tokenResponse.data));
      } catch (error) {
        console.log("Error fetching user with token:", error);
      }
    };
    fetchUser();
  }, []);
  return (
    <div>
      {/* headers section */}
      <div className="flex items-center sm:pl-10 pl-4 pt-10">
        <button onClick={() => navigate(-1)}>
          <img src={arrowLeftIcon} alt="left-arrow-btn" />
        </button>
        <h1 className="font-montserrat text-xl font-bold px-2">Profile</h1>
      </div>
      {/* profile options */}
      <div className="pl-5">
        <div className="flex items-center sm:pl-10 pl-4 pt-10">
          <div className="relative group">
            <button className="sm:block p-2 font-poppins font-semibold text-lg rounded-full bg-gray-200 w-20 h-20 hover:bg-gray-300 focus:outline-none">
              {user.avatar ? (
                <img
                  src={`${BASE_URL}/uploads/${user.avatar}`}
                  alt="image-preview"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                userFirstLetter
              )}
            </button>
            <button
              className="absolute bottom-0 right-0 m-2  opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              onClick={() => navigate("/update-avatar")}
            >
              <img src={editIcon} alt="edit-icon" />
            </button>
          </div>
          <div className="flex flex-col pl-5">
            <p className="font-poppins font-bold text-xl">{userName}</p>
            <p className="font-poppins text-sm  text-gray-400">{bio}</p>
          </div>
          <button
            className=" sm:block hidden bg-black text-white text-xs font-poppins px-2 py-2 rounded-full ml-10 hover:bg-white hover:text-black border-black border-2 transition-all duration-300 mr-4"
            onClick={() => navigate("/update-profile")}
          >
            Edit profile
          </button>
          <button
            className="sm:hidden bg-black w-full text-white text-xs font-poppins px-2 py-2 rounded-full ml-10 hover:bg-white hover:text-black border-black border-2 transition-all duration-300 mr-4"
            onClick={() => navigate("/update-profile")}
          >
            Edit
          </button>
        </div>
      </div>
      <div className="sm:mx-20 mx-10 pt-10">
        <ul>
          <li
            className=" flex py-2 px-2 hover:bg-gray-100 cursor-pointer font-poppins"
            onClick={() => navigate("/my-stories")}
          >
            <img src={fileIcon} alt="stories-icon" className="px-1 pr-4" /> My
            Stories
          </li>
          <li
            className=" flex py-2 px-2 hover:bg-gray-100 cursor-pointer mt-2 font-poppins"
            onClick={() => navigate("/bookmarks")}
          >
            <img src={bookmarkIcon} alt="bookmark-icon" className="px-1 pr-4" />{" "}
            Bookmarks
          </li>
          {/* if user logged in using google account dont show option for changing password */}
          {!googleId && (
            <li
              className=" flex py-2 px-2 hover:bg-gray-100 cursor-pointer mt-2 font-poppins"
              onClick={() => navigate("/change-password")}
            >
              <img
                src={passwordIcon}
                alt="password-icon"
                className="px-1 pr-4"
              />{" "}
              Change password
            </li>
          )}
          <li
            className=" flex py-2 px-2 hover:bg-gray-100 cursor-pointer mt-2 font-poppins"
            onClick={() => {
              localStorage.clear();
              window.open(`${BASE_URL}/auth/logout`);
              dispatch(setUser({}));
            }}
          >
            <img src={logoutIcon} alt="logout-icon" className="px-1 pr-4" />{" "}
            Logout
          </li>
        </ul>
      </div>
    </div>
  );
}

export default UserProfilePage;
