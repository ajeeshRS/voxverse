import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import SearchSvg from "../assets/Search.svg";
import Hamburger from "../assets/Sort.svg";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggle } from "../state/slices/ToggleSlice";
import { BASE_URL } from "../helpers/urls";
import { setUser } from "../state/slices/UserStateSlice";
import axios from "axios";
import { getHeaders } from "../helpers/getHeaders";
import fileIcon from "../assets/File.svg";
import bookmarkIcon from "../assets/Bookmark.svg";
import userIcon from "../assets/User.svg";
import logoutIcon from "../assets/signOut.svg";
import userAddIcon from "../assets/UserAdd.svg";
import loginIcon from "../assets/SignIn.svg";
import writeIcon from "../assets/FileAdd.svg";
import { setSearchResults } from "../state/slices/SearchSlice";
import Search from "./Search";

function NavBar() {
  // state for right menu button
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const menuButtonRef = useRef(null);
  const menuRef = useRef(null);

  // state for left hamburger button
  const isClicked = useSelector((state) => state.toggleMenu.value);

  const user = useSelector((state) => state.userState.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch user data
  const fetchUser = useCallback(async () => {
    if (user) return; // Don't fetch if user is already in the state
    setLoading(true);
    try {
      const tokenResponse = await axios.get(`${BASE_URL}/user/get`, {
        headers: getHeaders(),
      });
      dispatch(setUser(tokenResponse.data));
      localStorage.setItem("user", tokenResponse.data);
    } catch (error) {
      // console.error("Error fetching user with token:", error);
      setError("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // memoize username and first letter logic
  const userFirstLetter = useMemo(() => {
    if (user?.username) {
      // console.log(user.username)
      return user.username.charAt(0).toUpperCase();
    }
  }, [user]);

  // Handle click outside of the menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Fetch user on component mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      fetchUser();
    } else {
      dispatch(setUser(storedUser));
    }
  }, [dispatch, fetchUser]);

  return (
    // Navbar
    <nav className="w-full z-[10] bg-white h-20 shadow-sm fixed">
      <div className="h-20 flex flex-row justify-between items-center">
        <div className="flex items-center justify-around md:w-[35%] w-24 h-20">
          <img
            src={Hamburger}
            alt="hamburger-menu"
            className="md:hidden w-[45px] h-[45px] pb-2 cursor-pointer "
            // using dispatch to toggle hamburger menu
            onClick={() => {
              dispatch(toggle());
            }}
          />
          <p
            className="text-[#36453B] text-3xl font-bold  font-josefin w-10 cursor-pointer"
            onClick={() => navigate("/")}
          >
            VoxVerse
          </p>
          <div className=" flex-row w-48 text-gray-500 justify-between ml-10 font-montserrat md:flex hidden ">
            <p className="px-1 font-medium hover:text-black transition duration-300 cursor-pointer">
              <Link to="/articles">Articles</Link>
            </p>
            {/* if user object have any keys (checking user is exist or not) then conditinally rendering items */}
            {Object.keys(user).length !== 0 ? (
              <p className="px-1 font-medium hover:text-black transition duration-300 cursor-pointer pr-6">
                <Link to="/new-post">Write</Link>
              </p>
            ) : (
              <p className="px-1 font-medium hover:text-black transition duration-300 cursor-pointer">
                <Link to="/signup">Be a writer</Link>
              </p>
            )}
          </div>
        </div>
        <div className="flex md:justify-between justify-around items-center  h-20 md:relative">
          {/* search component */}

          <Search />
          <div className="flex justify-around items-center md:w-48 h-20 mx-4 ">
            {Object.keys(user).length !== 0 ? (
              <>
                <div className="relative">
                  <button
                    className="sm:block hidden p-2 rounded-full bg-gray-200 w-14 h-14 hover:bg-gray-300 focus:outline-none relative overflow-hidden"
                    // opening and closing of right side menu
                    ref={menuButtonRef}
                    onClick={() => setMenuOpen(!menuOpen)}
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="image-preview"
                        className="w-full h-full object-cover rounded-full "
                      />
                    ) : (
                      <span className="text-black text-xl">
                        {userFirstLetter}
                      </span>
                    )}{" "}
                  </button>
                  {/* if menu button is clicked then display the options */}
                  {menuOpen && (
                    <div
                      ref={menuRef}
                      className="absolute right-0 mt-6 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1"
                    >
                      {/* Options content here */}
                      <ul>
                        <li
                          className=" flex py-2 px-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => navigate("/my-stories")}
                        >
                          <img src={fileIcon} alt="" className="px-1" /> My
                          Stories
                        </li>
                        <li
                          className=" flex py-2 px-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => navigate("/bookmarks")}
                        >
                          <img src={bookmarkIcon} alt="" className="px-1" />{" "}
                          Bookmarks
                        </li>
                        <li
                          className=" flex py-2 px-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => navigate("/profile")}
                        >
                          <img src={userIcon} alt="" className="px-1" /> Profile
                        </li>
                        <li
                          className=" sm:flex py-2 px-2 hover:bg-gray-100 cursor-pointer hidden"
                          // logout functionality
                          onClick={() => {
                            localStorage.clear();
                            window.open(`${BASE_URL}/auth/logout`);
                            dispatch(setUser({}));
                          }}
                        >
                          <img src={logoutIcon} alt="" className="px-1" />{" "}
                          Logout
                        </li>
                      </ul>
                    </div>
                  )}
                </div>{" "}
              </>
            ) : (
              <button className="w-24 h-10 bg-black text-white rounded-full  hover:bg-[#262626]  transition shadow-md  duration-500 ease-in-out md:block hidden ">
                <Link to={"/login"}>Log in</Link>
              </button>
            )}
          </div>
        </div>
      </div>
      {/* left side hamburger menu */}
      {isClicked && (
        <div
          className={`md:hidden  fixed inset-y-0 z-10 flex flex-col items-start bg-white w-[80%] px-4 py-6 space-y-4 mt-20 shadow-md duration-200 transition ease-in-out`}
        >
          <li
            className="py-2 w-full list-none text-black text-2xl hover:text-gray-300 font-montserrat font-semibold flex items-center px-1"
            // dispatching the toggle to close the menu on switching to other pages
            onClick={() => {
              dispatch(toggle());
            }}
          >
            <img src={fileIcon} alt="article-logo" className="pr-5  " />
            <Link to="/articles" className="text-xl">
              Articles
            </Link>
          </li>

          {Object.keys(user).length !== 0 ? (
            <>
              <li
                className="py-2 w-full list-none text-black text-2xl hover:text-gray-300 font-montserrat font-semibold flex items-center px-1"
                onClick={() => {
                  dispatch(toggle());
                }}
              >
                <img src={fileIcon} alt="my-story-logo" className="pr-5  " />
                <Link to="/my-stories" className="text-xl">
                  My Stories
                </Link>
              </li>
              <li
                className="py-2 w-full list-none text-black text-2xl hover:text-gray-300 font-montserrat font-semibold flex items-center px-1"
                onClick={() => {
                  dispatch(toggle());
                }}
              >
                <img src={writeIcon} alt="write-logo" className="pr-5" />
                <Link to="/new-post" className="text-xl">
                  Write
                </Link>
              </li>
            </>
          ) : (
            <li className="py-2 w-full list-none text-black text-2xl hover:text-gray-300 font-montserrat font-semibold flex items-center px-1">
              <img src={userAddIcon} alt="user-add-logo" className="pr-5" />
              <Link to="/signup" className="text-xl">
                Be a writer
              </Link>
            </li>
          )}

          {Object.keys(user).length !== 0 ? (
            <>
              <li
                className="py-2 w-full list-none text-black text-2xl hover:text-gray-300 font-montserrat font-semibold flex items-center px-1"
                onClick={() => {
                  dispatch(toggle());
                }}
              >
                <img src={bookmarkIcon} alt="bookmark-logo" className="pr-5 " />
                <Link to="/bookmarks" className="text-xl">
                  Bookmarks
                </Link>
              </li>
              <li
                className="py-2 w-full list-none text-black text-2xl hover:text-gray-300 font-montserrat font-semibold flex items-center px-1"
                onClick={() => {
                  dispatch(toggle());
                }}
              >
                <img src={userIcon} alt="profile-logo" className="pr-5 " />
                <Link to="/profile" className="text-xl">
                  Profile
                </Link>
              </li>
              <li
                onClick={() => {
                  localStorage.clear();
                  window.open(`${BASE_URL}/auth/logout`);
                  dispatch(setUser({}));
                }}
                className="py-2 w-full list-none text-black text-2xl hover:text-gray-300 font-montserrat font-semibold flex items-center px-1"
              >
                <img src={logoutIcon} alt="logout-logo" className="pr-5" />
                <Link to="/login" className="text-xl">
                  Log out
                </Link>
              </li>
            </>
          ) : (
            <li className="py-2 w-full list-none text-black text-2xl hover:text-gray-300 font-montserrat font-semibold flex items-center px-1">
              <img src={loginIcon} alt="login-logo" className="pr-5" />
              <Link to="/login" className="text-xl">
                Log in
              </Link>
            </li>
          )}
        </div>
      )}
    </nav>
  );
}

export default NavBar;
