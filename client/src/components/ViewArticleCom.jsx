import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { BASE_URL } from "../helpers/urls";
import { formatDate } from "../helpers/userHelpers";
import addIcon from "../assets/Bookmark.svg";
import removeIcon from "../assets/BookmarkOpen.svg";
import axios from "axios";
import { setAllBlogs } from "../state/slices/AllBlogSlice";
import { getHeaders } from "../helpers/getHeaders";
import {
  notifyAddBookmark,
  notifyRemoveFromBookmarks,
} from "../helpers/toastify";
import { ToastContainer } from "react-toastify";

function ViewArticleCom() {
  // getting user info
  const user = useSelector((state) => state.userState.user);

  // Extracting id from the url using the useParams() hook
  const { id } = useParams();

  // state for isbookmarked
  const [isBookmarked, setIsBookmarked] = useState(false);

  // state for loading state
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  // getting the blogData from the redux store
  const blogData = useSelector((state) => state.allBlogState.allBlogs);

  // filtering the blog with the id from the url to display the individual blog
  const blog = blogData.filter((obj) => obj.id == id);

  // add to bookmarks
  const addToBookmarks = async (id) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/user/bookmark/add/${id}`,
        {},
        {
          headers: getHeaders(),
        }
      );
      console.log(res.data);
      // show toast message
      notifyAddBookmark();
      setIsBookmarked(true); // Update isBookmarked state
    } catch (error) {
      console.log(error);
    }
  };
  // Remove from bookmarks
  const removeFromBookmarks = async (id) => {
    try {
      const res = await axios.delete(`${BASE_URL}/user/bookmark/delete/${id}`, {
        headers: getHeaders(),
      });
      console.log(res.data);
      // show toast message
      notifyRemoveFromBookmarks();
      setIsBookmarked(false); // Update isBookmarked state
    } catch (error) {
      console.log(error);
    }
  };

  // function to fetch all blogs
  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user/get/all-blogs`);
      // setting the blog data from the response using dispatch function
      dispatch(setAllBlogs(response.data));
      setLoading(false); // Set loading to false once data is loaded
    } catch (err) {
      console.log(err);
    }
  };

  // Use isBookmarked state to determine which icon to display
  const bookmarkIcon = isBookmarked ? removeIcon : addIcon;

  // Use toggleAdd state to toggle bookmark status
  const handleToggleBookmark = () => {
    if (isBookmarked) {
      // if bookmarked remove it
      removeFromBookmarks(id);
    } else {
      // else add it
      addToBookmarks(id);
    }
  };

  // for setting loading false when data is loaded
  useEffect(() => {
    if (blogData.length > 0) {
      setLoading(false);
    }
  }, [blogData]);

  // To fetch blog when its length = 0
  useEffect(() => {
    // Fetch blog data only if it's not available
    if (blogData.length === 0) {
      fetchBlogs();
    } else {
      // If blog data is already available, set loading to false
      setLoading(false);
    }
  }, []);

  // checking the bookmark
  useEffect(() => {
    const checkBookmark = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/user/bookmark/get/${id}`,
          {
            headers: getHeaders(),
          }
        );
        if (response.data) {
          setIsBookmarked(true);
        }
      } catch (error) {
        console.log(error);
      }
    };
    checkBookmark();
  }, [id]);

  // Scroll to the top of the page when component mounts or content changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <>
      {/* if the loading is true display the spinner animation */}
      {loading ? (
        <div className="pt-32">
          <div className="flex justify-center items-center h-screen">
            <div className="spinner border-t-4 border-b-4 border-gray-900 rounded-full w-12 h-12 animate-spin"></div>
          </div>
        </div>
      ) : // if the blog's length is >0 then map the array and display the details
      blog.length > 0 ? (
        blog.map((data, index) => (
          <div key={index} className="pt-32 flex">
            <div className="wrapper flex flex-col items-center">
              <div className="sm:w-2/4 w-full px-6 sm:px-0">
                {/* title */}
                <h1 className="font-montserrat text-2xl font-bold ">
                  {data.title}
                </h1>
              </div>
              {/* image */}
              <div className="py-5">
                <img
                  className="sm:w-[550px] sm:h-[250px]"
                  src={`${BASE_URL}/uploads/${data.image_filename}`}
                  alt=""
                />
              </div>
              {/* username ,date,add bookmark button */}
              <div className="sm:w-2/4 w-full flex gap-5 items-center justify-center">
                <p className="font-sans text-black font-semibold text-sm">
                  {data.user_id.toUpperCase()}
                </p>
                <p className="text-gray-600">{formatDate(data.created_at)}</p>
                {Object.keys(user).length !== 0 && (
                  <button onClick={handleToggleBookmark}>
                    <img
                      src={bookmarkIcon}
                      alt={isBookmarked ? "remove-icon" : "add-icon"}
                    />
                  </button>
                )}
                {/* toast container*/}
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
              {/* content */}
              <div className="sm:w-2/4 py-10 w-full px-10 sm:px-0 space-sentence leading-loose font-poppins">
                <p>{data.content}</p>
              </div>
              {/* displaying tags */}
              <div className="flex sm:w-2/4 w-full sm:justify-normal justify-center py-5 gap-5">
                {data.tags.map((tag) => (
                  <p className="px-2 w-auto h-auto bg-gray-300 rounded-full py-2">
                    {tag}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))
      ) : (
        // if no articles where found display the message
        <div className="flex w-full h-[100vh] justify-center items-center ">
          <h1 className="font-montserrat font-bold text-lg">
            Article not found
          </h1>
        </div>
      )}
    </>
  );
}

export default ViewArticleCom;
