import React from "react";
import {  useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { formatDate, getRandomElements } from "../helpers/userHelpers";
import { BASE_URL } from "../helpers/urls";
function OtherArticles() {
  // getting the blogs from the redux state store
  const allBlogs = useSelector((state) => state.allBlogState.allBlogs);

  // function to navigate between pages
  const navigate = useNavigate();

  // getting random 6 element to display
  const otherArticles = getRandomElements(allBlogs, 6);

  return (
    <div className="w-full pt-5">
      <div>
        <p className="w-full sm:pl-10 pl-5 font-sans font-bold  text-3xl bg-white">
          Other articles
        </p>
      </div>
      <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 w-full items-center justify-between sm:h-full sm:pl-10 sm:mb-20 pb-10 pt-8 px-5  ">
        {/* if the articles are there then map and display the details */}
        {otherArticles ? (
          otherArticles.map((data, index) => (
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
                <p className=" text-black w-20   rounded-full mt-3 text-sm ml-3 h-6 flex items-center justify-center border-[1px] border-black">
                  {data.tags[0]}
                </p>
                <p
                  className="px-4 py-2 font-montserrat font-bold sm:text-xl text-sm max-h-28 overflow-hidden hover:underline cursor-pointer"
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
        ) : (
          // if no articles where found then display the message
          <div className="flex w-full h-[100vh] justify-center items-center ">
            <h1 className="font-montserrat font-bold text-lg">
              ! Article not found
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default OtherArticles;
