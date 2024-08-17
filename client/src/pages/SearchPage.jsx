import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { formatDate } from "../helpers/userHelpers";
import { BASE_URL } from "../helpers/urls";
import axios from "axios";

function SearchPage() {
  const { query } = useParams();
  const [searchResults, setSearchResults] = useState([]);
  const result = useSelector((state) => state.searchResultState.searchResult);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // if the result and result has length atleast 1 set the state from the redux store
  useEffect(() => {
    if (result && result.length > 0) {
      setSearchResults(result);
    }
  }, [result]);

  // search for blogs whenever the query changes
  useEffect(() => {
    const onSearch = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/user/blogs/search/${query}`
        );

        dispatch(setSearchResults(response.data));

      } catch (error) {
        console.log(error);
        if (error.response.status === 404) {
          // if no blogs wher found then empty the state
          dispatch(setSearchResults([]));
        }
      }
    };
    onSearch();
  }, [query, dispatch]);
  return (
    <div>
      <NavBar />
      <div className="pt-28 sm:pl-32 pl-5">
        <p className="text-gray-400 font-semibold font-poppins text-3xl">
          Results for <span className="text-black">{query}</span>
        </p>
      </div>
      <div className="grid  grid-cols-1 gap-4 w-full items-center justify-between sm:h-full sm:mb-20 pb-10 pt-8 sm:px-32 px-4">
        {/* if the articles are there then map and display the details */}
        {searchResults.length > 0 ? (
          searchResults.map((data, index) => (
            <div
              key={index}
              className="relative bg-white h-[150px] sm:h-[180px] mt-2 w-full rounded-md shadow-md flex "
            >
              <img
                className="sm:w-[35%] w-[40%] h-full object-cover rounded-tl-md roun rounded-bl-md"
                src={data.image_path}
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
          <div className="flex w-full h-[50vh] justify-center flex-col  items-center ">
            <p className="font-poppins text-gray-500  text-lg">No results</p>
            <p className="font-poppins text-gray-500  text-lg">
              Try different keywords.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
