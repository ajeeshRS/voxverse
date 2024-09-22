import React, { useEffect, useState } from "react";
import { formatDate } from "../helpers/userHelpers";
import { useNavigate } from "react-router";
import axios from "axios";
import { BASE_URL } from "../helpers/urls";
import { getHeaders } from "../helpers/getHeaders";
import NavBar from "../components/NavBar";
import { useSelector } from "react-redux";
import trashIcon from "../assets/Trash.svg";
import { notifyRemoveFromBookmarks } from "../helpers/toastify";
import { ToastContainer } from "react-toastify";
import Loader from "../components/Loader";

function BookmarkPage() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState([]);

  const blogs = useSelector((state) => state.allBlogState.allBlogs);

  const bookmarkedIds = bookmarks.map((obj) => obj["blogid"]); //extracting ids from the row
  let bookmarkBlogs = blogs.filter((blog) => bookmarkedIds.includes(blog.id)); //getting the bookmarked blogs

  // Function to toggle menuOpen state for a specific index
  const toggleMenu = (index) => {
    setMenuOpen((prevMenuOpen) => {
      const newMenuOpen = [...prevMenuOpen];
      newMenuOpen[index] = !newMenuOpen[index];
      return newMenuOpen;
    });
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${BASE_URL}/user/bookmark/delete/${id}`, {
        headers: getHeaders(),
      });
      notifyRemoveFromBookmarks();
      setBookmarks((prevBookmarks) =>
        prevBookmarks.filter((bookmark) => bookmark.blogid !== id)
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/user/get/bookmarks`, {
          headers: getHeaders(),
        });
        setBookmarks(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <NavBar />
      <div className="pt-20 w-full ">
        {bookmarkBlogs.length > 0 && (
          <div className="py-5">
            <p className="w-full sm:pl-10 pl-5 font-sans font-bold  text-3xl bg-white">
              Bookmarks
            </p>
          </div>
        )}
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 w-full items-center justify-between sm:h-full sm:pl-10 sm:mb-20 pb-10 pt-8 px-5  ">
          {/* if the articles are there then map and display the details */}
          {bookmarkBlogs.length > 0 ? (
            bookmarkBlogs.map((data, index) => (
              <div
                key={index}
                className="relative bg-white h-[150px] sm:h-[180px] mt-2 w-full rounded-md shadow-md flex "
              >
                <img
                  className="sm:w-[35%] w-[40%] h-full object-cover rounded-tl-md roun rounded-bl-md"
                  src={`${BASE_URL}/uploads/${data.image_filename}`}
                  alt="featured-image"
                />

                <div className="flex flex-col">
                  <div className="w-full flex justify-between px-1">
                    <p className=" text-black w-20   rounded-full mt-3 text-sm ml-3 h-6 flex items-center justify-center border-[1px] border-black">
                      {data.tags ? data.tags[0] : "no tags"}
                    </p>
                    <button
                      onClick={() => toggleMenu(index)}
                      className="text-2xl absolute right-3"
                    >
                      ...
                    </button>
                    {menuOpen[index] && (
                      <div className="absolute right-0 mt-8 w-28 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                        {/* Options content here */}
                        <ul>
                          <li
                            className=" flex py-2 px-2 hover:bg-gray-100 cursor-pointer text-red-600"
                            onClick={() => handleDelete(data.id)}
                          >
                            <img
                              src={trashIcon}
                              alt="delete-btn"
                              className="px-1 "
                            />{" "}
                            Delete
                          </li>
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
                        </ul>
                      </div>
                    )}
                  </div>
                  <p
                    className="px-4 py-2 font-montserrat font-bold sm:text-xl text-sm md:max-h-28 max-h-16 overflow-hidden hover:underline cursor-pointer"
                    // using encodeURIComponent to avoid the error caused by special characters in the url
                    onClick={() =>
                      navigate(
                        `/articles/${encodeURIComponent(data.title)}/${data.id}`
                      )
                    }
                  >
                    {data.title}
                  </p>
                  <div className="absolute bottom-2 px-4 flex justify-start sm:py-5 py-1 font-poppins text-xs ">
                    <p className="sm:block hidden">{data.user_id}</p>
                    <span className="px-1 sm:block hidden">&#x2022;</span>
                    <p>{formatDate(data.created_at)}</p>
                  </div>
                </div>
              </div>
            ))
          ) : loading ? (
            <div className="flex w-[95vw] h-[50vh] justify-center items-center ">
              <Loader />
            </div>
          ) : (
            // if no articles where found then display the message
            <div className="flex w-[95vw] h-[50vh] justify-center items-center ">
              <h1 className="font-poppins  text-lg text-gray-400">
                Nothing in the Bookmarks !
              </h1>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default BookmarkPage;
