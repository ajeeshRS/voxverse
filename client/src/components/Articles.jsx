import React, { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../helpers/urls";
import { useDispatch, useSelector } from "react-redux";
import { setBlog } from "../state/slices/BlogSlice";
import { formatDate } from "../helpers/userHelpers";
import { useNavigate } from "react-router";

function Articles() {
  // getting the blog state value
  const blogData = useSelector((state) => state.blogState.blogs);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  // extracting the first blog for the large card in the layout
  const extractedEl = blogData[0];

  // removing the extracted blog for the remaining 2 elements
  const remainingEl = blogData.slice(1);

  // fetching the latest 3 blogs for this fixed layout
  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user/get/latest-blogs`);
      // setting the blog data from the response using dispatch function
      dispatch(setBlog(response.data));
    } catch (err) {
      console.log(err);
    }
  };

  // fetch blog on component mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <>
      <div id="start-reading">
        <p className="w-full sm:pl-10 pl-5 font-sans font-bold pt-24 text-3xl bg-white">
          Latest posts
        </p>
      </div>
      <div className="w-[100%vh] h-auto sm:h-[100vh]  flex sm:flex-row flex-col sm:justify-between items-center bg-white  text-black pt-10 sm:pt-1 sm:px-5 pr-5 sm:pr-10  sm:pb-1 pb-10  ">
        {/* if extractedEl is there display the details */}
        {extractedEl && (
          <div className="left flex justify-center items-center sm:w-2/4 w-full  sm:h-3/4 sm:mb-20  ">
            <div className="card bg-white rounded-md h-full  my-20  mx-5 mr-5 w-full sm:flex flex-col shadow-md  hidden">
              <img
                className="w-full h-2/4 object-cover rounded-tl-md rounded-tr-md"
                src={`${BASE_URL}/uploads/${extractedEl.image_filename}`}
                alt=""
              />
              <div className="w-auto h-2/4  rounded-bl-md rounded-br-md  ">
                <p className=" text-black w-24 pl-1   rounded-full mt-3 text-sm ml-4 h-6 flex items-center justify-center border-[1px] border-black">
                  {extractedEl.tags[0]}
                </p>
                <p
                  className="px-4 py-1 font-montserrat font-bold text-xl cursor-pointer hover:underline"
                  onClick={() =>
                    // navigating to the page where individual blog is displayed
                    // using encodeURIComponent to avoid the error that caused by special characters in the url
                    navigate(
                      `/articles/${encodeURIComponent(extractedEl.title)}/${
                        extractedEl.id
                      }`
                    )
                  }
                >
                  {extractedEl.title}
                </p>
                <p className=" font-roboto text-sm px-4 max-h-14 overflow-hidden sm:block hidden">
                  {extractedEl.content}
                </p>
                <div className="px-4 flex justify-start py-6 font-poppins">
                  <p>{extractedEl.user_id}</p>
                  <span className="px-1">&#x2022;</span>
                  <p>{formatDate(extractedEl.created_at)}</p>
                </div>
              </div>
            </div>
            <div className="bg-white h-[150px] sm:h-[45%]  w-full rounded-md shadow-md flex sm:hidden ml-5 ">
              <img
                className="sm:w-[35%] w-[40%] h-full object-cover rounded-tl-md roun rounded-bl-md"
                src={`${BASE_URL}/uploads/${extractedEl.image_filename}`}
                alt=""
              />
              <div className="flex flex-col">
                <p className=" text-black w-20   rounded-full mt-3 text-sm ml-3 h-6 flex items-center justify-center border-[1px] border-black">
                  {extractedEl.tags[0]}
                </p>
                <p
                  className="px-4 py-2 font-montserrat font-bold sm:text-xl text-sm cursor-pointer hover:underline"
                  onClick={() =>
                    navigate(
                      `/articles/${encodeURIComponent(extractedEl.title)}/${
                        extractedEl.id
                      }`
                    )
                  }
                >
                  {extractedEl.title}
                </p>
                <div className="w-full px-4 flex justify-start sm:py-10 py-1 font-poppins sm:text-sm text-xs">
                  <p className="sm:block hidden">{extractedEl.user_id}</p>
                  <span className="px-1 sm:block hidden">&#x2022;</span>
                  <p>{formatDate(extractedEl.created_at)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="right flex  flex-col sm:w-2/4 w-full items-center justify-between sm:h-3/4 pl-5 sm:mb-20  ">
          {/* Displaying the remaining elements */}
          {remainingEl.map((data, index) => (
            <div
              key={index}
              className="bg-white h-[150px] sm:h-[45%] mt-2 w-full rounded-md shadow-md flex "
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
                  className="px-4 py-2 font-montserrat font-bold sm:text-xl text-sm cursor-pointer hover:underline"
                  onClick={() =>
                    navigate(
                      `/articles/${encodeURIComponent(data.title)}/${data.id}`
                    )
                  }
                >
                  {data.title}
                </p>
                <div className="px-4 flex justify-start sm:py-10 py-1 font-poppins text-xs ">
                  <p className="sm:block hidden">{data.user_id}</p>
                  <span className="px-1 sm:block hidden">&#x2022;</span>
                  <p>{formatDate(data.created_at)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Articles;
