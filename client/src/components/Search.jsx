import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setSearchResults } from "../state/slices/SearchSlice";
import { useNavigate } from "react-router";
import SearchSvg from "../assets/Search.svg";
import { BASE_URL } from "../helpers/urls";
import { notifySearchInputErr } from "../helpers/toastify";
import axios from "axios";
import { ToastContainer } from "react-toastify";

function Search() {
  const [searchInput, setSearchInput] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSearch = async () => {
    try {
      if (searchInput !== null) {
        const response = await axios.get(
          `${BASE_URL}/user/blogs/search/${searchInput}`
        );
        // If there are results, dispatch them and navigate
        dispatch(setSearchResults(response.data));
        navigate(`/search/${encodeURIComponent(searchInput)}`);
      } else {
        notifySearchInputErr();
      }
    } catch (error) {
      console.log(error);

      if (error.response.status === 404) {
        navigate(`/search/${encodeURIComponent(searchInput)}`);
      }
    }
  };

  return (
    <div className="flex md:justify-between justify-around items-center  h-20 md:relative sm:ml-0 ml-2">
      <button
        className="md:absolute w-[35px] h-[35px] pl-1  cursor-pointer"
        type="submit"
      >
        <img
          src={SearchSvg}
          alt="search-icon"
          onClick={() => {
            onSearch();
          }}
        />
      </button>
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
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
        className="sm:w-52 w-28 bg-[#f5f5f5] h-10 rounded-full focus:outline-none sm:pl-9 pl-4  pr-5 sm:ml-0"
        placeholder="Search..."
      />
    </div>
  );
}

export default Search;
