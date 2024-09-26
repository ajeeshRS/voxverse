import React, { useMemo } from "react";
import externalIcon from "../assets/External.svg";
import { useDispatch, useSelector } from "react-redux";
import { getRandomElements } from "../helpers/userHelpers";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function PopularArticles() {
  // getting the blogs from the redux state store
  const allBlogs = useSelector((state) => state.allBlogState.allBlogs);

  // function to navigate between pages
  const navigate = useNavigate();

  // getting random 8 element to display
  const popularArticles = useMemo(
    () => getRandomElements(allBlogs, 8),
    [allBlogs]
  );

  return (
    <div className="w-ful pb-10 bg-gradient-to-b from-slate-100 to-[#fff] pt-5">
      <p className="w-full sm:pl-10 pl-5 font-sans font-bold  text-3xl">
        Popular articles
      </p>
      <div className=" w-full flex sm:px-10 px-5  pt-10">
        <div className="w-full h-fit grid md:grid-cols-4 grid-cols-1 gap-4">
          {/* if the articles are there then map and display the details */}
          {popularArticles ? (
            popularArticles.map((data, index) => (
              <motion.div
                key={index}
                whileHover={{ translateY: -5 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="relative wrapper w-full h-[200px] rounded-md shadow-md bg-white p-5 cursor-pointer "
              >
                <p
                  className="font-montserrat text-lg font-bold max-h-14 overflow-hidden cursor-pointer hover:underline "
                  // using encodeURIComponent to avoid the error caused by special characters in the url
                  onClick={() =>
                    navigate(
                      `/articles/${encodeURIComponent(data.title)}/${data.id}`
                    )
                  }
                >
                  {data.title}
                </p>
                <p className="font-poppins text-sm py-4 max-h-14 overflow-hidden ">
                  {data.content}
                </p>
                <p
                  className="py-2 flex w-full absolute bottom-2 cursor-pointer"
                  onClick={() =>
                    navigate(
                      `/articles/${encodeURIComponent(data.title)}/${data.id}`
                    )
                  }
                >
                  Read article{" "}
                  <a className="px-2" href="">
                    <img src={externalIcon} alt="external-link icon" />
                  </a>
                </p>
              </motion.div>
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
    </div>
  );
}

export default PopularArticles;
