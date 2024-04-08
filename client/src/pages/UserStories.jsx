import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import axios from "axios";
import { BASE_URL } from "../helpers/urls";
import { getHeaders } from "../helpers/getHeaders";
import { useNavigate } from "react-router";
import { formatDate } from "../helpers/userHelpers";
import trashIcon from "../assets/Trash.svg";
import editIcon from "../assets/Edit.svg";
import { notifyBlogDeletion, notifyBlogDeletionErr } from "../helpers/toastify";
function UserStories() {
  const [userBlogs, setUserBlogs] = useState([]);
  const [userDrafts, setUserDrafts] = useState([]);
  const [menuOpen, setMenuOpen] = useState([]);
  const navigate = useNavigate();

  // function to fetch user blogs
  const fetchUserBlogs = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user/get/user-blogs`, {
        // including authorization header
        headers: getHeaders(),
      });
      // setting user blog state
      setUserBlogs(response.data);

      setMenuOpen(Array(response.data.length).fill(false));
    } catch (error) {
      console.log(error);
    }
  };

  //function to fetch drafts by the user
  const fetchUserDrafts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user/get/user-drafts`, {
        // including authorization header
        headers: getHeaders(),
      });
      // setting user draft state
      setUserDrafts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to toggle menuOpen state for a specific index
  const toggleMenu = (index) => {
    setMenuOpen((prevMenuOpen) => {
      const newMenuOpen = [...prevMenuOpen];
      newMenuOpen[index] = !newMenuOpen[index];
      return newMenuOpen;
    });
  };

  const handleDelete = async(id)=>{
    try {
      const message = await axios.delete(`${BASE_URL}/user/delete-story/${id}`,{
        headers:getHeaders()
      })
      // after success deletion fetch user blogs again to uptate the stories
      if(message.status == 200){
        notifyBlogDeletion(message.data)
        fetchUserBlogs()
      }
    } catch (error) {
      console.log(error)
      if(error.response.status == 400){
        notifyBlogDeletionErr(error.response.data)
      }
    }
  }

  // fetch blog on component load
  useEffect(() => {
    fetchUserBlogs();
  }, []);

  // fetch drafts on component load
  useEffect(() => {
    fetchUserDrafts();
  }, []);

  return (
    <>
      {/* navbar component */}
      <NavBar />
      <div className="pt-20 w-full ">
        <div className="py-5">
          <p className="w-full sm:pl-10 pl-5 font-sans font-bold  text-3xl bg-white">
            My Stories
          </p>
        </div>
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 w-full items-center justify-between sm:h-full sm:pl-10 sm:mb-20 pb-10 pt-8 px-5  ">
          {/* if the articles are there then map and display the details */}
          {userBlogs ? (
            userBlogs.map((data, index) => (
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
                            className=" flex py-2 px-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => navigate(`/my-stories/edit/${data.id}`,{state:{article:userBlogs.filter((obj)=>obj.id == data.id)}})}
                          >
                            <img
                              src={editIcon}
                              alt="edit-btn"
                              className="px-1"
                            />
                            Edit
                          </li>
                          <li className=" flex py-2 px-2 hover:bg-gray-100 cursor-pointer text-red-600" onClick={()=>handleDelete(data.id)}>
                            <img
                              src={trashIcon}
                              alt="delete-btn"
                              className="px-1 "
                            />{" "}
                            Delete
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
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
                No post where created since.
              </h1>
            </div>
          )}
        </div>
      </div>
      <div className="py-5">
        <p className="w-full sm:pl-10 pl-5 font-sans font-bold  text-3xl bg-white">
          Drafts
        </p>
      </div>
      <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 w-full items-center justify-between sm:h-full sm:pl-10 sm:mb-20 pb-10 pt-8 px-5  ">
        {/* if the articles are there then map and display the details */}
        {userDrafts.length > 0 ? (
          userDrafts.map((data, index) => (
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
                  {data.tags ? data.tags[0] : "No tags"}
                </p>
                <p
                  className="px-4 py-2 font-montserrat font-bold sm:text-xl text-sm max-h-28 overflow-hidden hover:underline cursor-pointer"
                  // using encodeURIComponent to avoid the error caused by special characters in the url
                  onClick={() =>
                    navigate(`/new-post`, {
                      state: {
                        article: userDrafts.filter((obj) => obj.id == data.id),
                      },
                    })
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
          <div className="flex w-full h-[20vh] justify-center items-center ">
            <h1 className="font-montserrat font-bold text-lg">
              No drafts where created by the user
            </h1>
          </div>
        )}
      </div>
    </>
  );
}

export default UserStories;
