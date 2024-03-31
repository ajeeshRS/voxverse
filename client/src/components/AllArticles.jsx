import React, { useEffect } from "react";
import NavBar from "./NavBar";
import axios from "axios";
import { BASE_URL } from "../helpers/urls";
import { useDispatch, useSelector } from "react-redux";
import { setAllBlogs } from "../state/slices/AllBlogSlice";
import { formatDate } from "../helpers/userHelpers";
import { useNavigate } from "react-router";
function AllArticles() {
  // getting the blogdata from the redux store that is retrieved from backend
  const allBlogs = useSelector((state) => state.allBlogState.allBlogs);

  // dispatch to make changes to the redux state
  const dispatch = useDispatch();

  // navigate function provided by react router dom for navigating between pages
  const navigate = useNavigate();

  // function to fetch all blogs from the backend
  const fetchAllArticles = async () => {
    try {
      // using axios to talk with backend
      const response = await axios.get(`${BASE_URL}/user/get/all-blogs`);
      // setting the state using the dispatch
      dispatch(setAllBlogs(response.data));
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch blogs on component mount
  useEffect(() => {
    fetchAllArticles();
  }, []);

  return (
    <>
    {/* navbar component */}
      <NavBar />
      {/* All article container */}
      <div className="w-full pt-24">
        <div>
          <p className="w-full sm:pl-10 pl-5 font-sans font-bold  text-3xl bg-white">
            All Articles
          </p>
        </div>
        <div className="grid sm:grid-cols-3 grid-cols-1 gap-4 w-full items-center justify-between sm:h-full sm:pl-10 sm:mb-20 pb-10 pt-8 px-5  ">
          {/* if allblogs are there then map the array and display the details */}
          {allBlogs ? (
            allBlogs.map((data, index) => (
              <div
                key={index}
                className="relative bg-white h-[150px] sm:h-[180px] mt-2 w-full rounded-md shadow-md flex "
              >
                <img
                  className="sm:w-[35%] w-[40%] h-full object-cover rounded-tl-md roun rounded-bl-md"
                  src={`${BASE_URL}/uploads/${data.image_filename}`}
                  alt=""
                />

                <div className="flex flex-col">
                  <p className=" text-black w-24   rounded-full mt-3 text-sm ml-3 h-6 flex items-center justify-center border-[1px] border-black">
                    {data.tags[0]}
                  </p>
                  <p
                    className="px-4 py-1 font-montserrat font-bold sm:text-xl text-sm max-h-24 overflow-hidden hover:underline cursor-pointer"
                    onClick={() =>
                      navigate(
                        `/articles/${encodeURIComponent(data.title)}/${data.id}`
                      )
                    }
                  >
                    {data.title}
                  </p>

                  <div className="absolute bottom-1 px-4 flex justify-start sm:py-5 py-1 font-poppins text-xs ">
                    <p className="sm:block hidden">{data.user_id}</p>
                    <span className="px-1 sm:block hidden">&#x2022;</span>
                    <p>{formatDate(data.created_at)}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // if no article where found then display the message
            <div className="flex w-full h-[100vh] justify-center items-center ">
              <h1 className="font-montserrat font-bold text-lg">
                ! Article not found
              </h1>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AllArticles;
