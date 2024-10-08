import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { BASE_URL } from "../helpers/urls";
import {
  notifyBlogCreation,
  notifyBlogDraftCreation,
  notifyTagErr,
} from "../helpers/toastify";
import { ToastContainer } from "react-toastify";
import backicon from "../assets/back.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { getHeaders } from "../helpers/getHeaders";
import Loader from "../components/Loader";

function NewPostPage() {
  const { register, handleSubmit, formState, reset, setValue } = useForm();
  const location = useLocation();
  const article = location.state && location.state.article;

  const navigate = useNavigate();

  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingDraftSub, setLoadingDraftSub] = useState(false);

  // To handle tag input change
  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
    console.log(e.target.value);
  };

  // To add taginput when pressing enter key
  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      setTags([...tags, tagInput.trim()]);
      console.log(tags);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove, e) => {
    e.preventDefault();
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const deleteDraft = async (id) => {
    try {
      setLoading(true);
      // requesting for delete draft
      const data = await axios.delete(`${BASE_URL}/user/delete-draft/${id}`, {
        // including authorization header
        headers: getHeaders(),
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // on submit function(publish blog)
  const onSubmit = async (data, e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    // creating new formData and appendin the required datas
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("image", data.image[0]);
    formData.append("content", data.content);
    tags.forEach((tag) => {
      formData.append("tags[]", tag); // Append each element of the array with the same key
    });

    try {
      setLoading(true);
      // sending data to the backend
      const res = await axios.post(`${BASE_URL}/user/new-blog`, formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Including  token
          "Content-Type": "multipart/form-data",
        },
      });
      setLoading(false);
      if (res.status == 200) {
        // toast message
        notifyBlogCreation();
        // reseting forms
        reset();
        setTags([]);
        setTagInput("");
        // after publishing the blog if the article that is draft is there delete the draft
        article && deleteDraft(article[0].id);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  // on submit function(draft blog)
  const submitDraft = async (data, e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    // creating new formData and appending the required datas
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("image", data.image[0]);
    formData.append("content", data.content);
    tags.forEach((tag) => {
      formData.append("tags[]", tag); // Append each element of the array with the same key
    });
    try {
      setLoadingDraftSub(true);
      // sending data to the backend
      const res = await axios.post(`${BASE_URL}/user/new-draft`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setLoadingDraftSub(false);
      if (res.status == 200) {
        // toast message
        notifyBlogDraftCreation();
        // reset forms
        reset();
        setTags([]);
        setTagInput("");
      }
    } catch (err) {
      console.log(err);
      setLoadingDraftSub(false);
    }
  };

  useEffect(() => {
    if (article !== null) {
      // Pre-fill form fields with article data
      setValue("title", article[0].title);
      setValue("image", article[0].image_filename);
      setValue("content", article[0].content);
    }
  }, [article, setValue]);
  return (
    <div>
      {/* navbar */}
      <nav className="w-full h-24 flex  text-center sm:justify-around justify-center  items-center fixed  z-10 bg-white">
        {/* hero text with back button */}
        <div className="sm:w-2/4 w-full flex items-center">
          <button className="px-6 cursor-pointer" onClick={() => navigate(-1)}>
            <img src={backicon} alt="back-button-icon" />
          </button>
          <p className="text-[#36453B] text-xl font-bold  font-josefin sm:pr-10 ">
            VoxVerse
          </p>
        </div>
        <div className="sm:block hidden w-2/4 ">
          {/* save draft button */}
          <button
            type="submit"
            onClick={handleSubmit((data, e) =>
              tags.length !== 0 ? submitDraft(data, e) : notifyTagErr()
            )}
            className="mx-1 rounded-full text-white px-3 py-2  bg-red-500  hover:bg-red-600 text-sm "
          >
            {loadingDraftSub ? <Loader /> : "Save Draft"}
          </button>
          {/* publish button */}
          <button
            type="submit"
            onClick={handleSubmit((data, e) =>
              tags.length !== 0 ? onSubmit(data, e) : notifyTagErr()
            )}
            disabled={formState.isSubmitting}
            className="mx-1 rounded-full text-white px-3 py-2 bg-black hover:bg-[#262626] text-sm "
          >
            {loading ? <Loader /> : "publish"}
          </button>
         
        </div>
        {/* toast container */}
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
      </nav>
      {/* navbar ends */}
      {/* form */}
      <div className="">
        <form className="w-full flex  flex-col items-center pt-28">
          <div className="flex flex-col items-start">
            {/* title */}
            <label
              htmlFor="title"
              className="font-medium font-poppins text-sm pl-2 pb-1"
            >
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Title"
              {...register("title", { required: true })}
              className="md:w-[500px] bg-[#f5f5f5] h-10 rounded-lg focus:outline-none pl-4 w-[240px] pr-5"
            />
          </div>
          <div className="flex flex-col items-start mt-4">
            {/*featured image  */}
            <label
              htmlFor="image"
              className="font-medium font-poppins text-sm pl-2 pb-1"
            >
              Featured Image
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              {...register("image", { required: true })}
              className="md:w-[500px]  bg-[#f5f5f5] h-10 rounded-lg focus:outline-none pl-4 w-[240px] pr-5"
            />
          </div>
          <div className="flex flex-col items-start mt-4">
            {/* content */}
            <label
              htmlFor="content"
              className="font-medium font-poppins text-sm pl-2 pb-1"
            >
              Content
            </label>
            <textarea
              id="content"
              name="content"
              placeholder="Type your content here..."
              {...register("content", { required: true })}
              className="md:w-[500px] bg-[#f5f5f5] w-[240px] rounded-lg focus:outline-none pl-4 pt-2 pb-2 pr-5 resize-none" // Added resize-none to prevent resizing
              style={{ verticalAlign: "top" }} // Aligns text to the top-left corner
              rows={6} // Set the number of visible rows
            />
          </div>
          <div className="mt-4">
            {/* tags */}
            <label
              htmlFor="tags"
              className="font-medium font-poppins text-sm pl-2 pb-1"
            >
              Tags
            </label>
            <div className="flex flex-wrap flex-col">
              <input
                type="text"
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyDown={handleTagInputKeyDown}
                placeholder="Type and press Enter to add tags"
                className="md:w-[500px]  bg-[#f5f5f5] h-10 rounded-lg focus:outline-none pl-4 w-[240px] pr-5"
              />
              <div className="grid grid-cols-3">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="bg-gray-200 rounded-lg px-2 py-1 mr-2 mb-2 mt-4 flex items-center flex-wrap"
                  >
                    {tag}
                    {/* tag remove button */}
                    <button
                      onClick={(e) => handleRemoveTag(tag, e)}
                      className="ml-2 focus:outline-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 1a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm4.293 5.293a1 1 0 0 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 1 1-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L8.586 10 4.293 5.707a1 1 0 0 1 1.414-1.414L10 8.586l4.293-4.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>
        {/* for mobile screen */}
        <div className="block sm:hidden w-full text-center mt-14 ">
          {/* save draft button */}
          <button
            type="submit"
            onClick={handleSubmit((data, e) => submitDraft(data, e))}
            className=" mx-2 rounded-full text-white px-3  bg-red-500  hover:bg-red-600 text-sm w-auto h-[35px]"
          >
            Save draft
          </button>
          {/* pubilsh button */}
          <button
            type="submit"
            onClick={handleSubmit((data, e) => onSubmit(data, e))}
            disabled={formState.isSubmitting}
            className=" mx-2 rounded-full text-white px-3 bg-black hover:bg-[#262626] text-sm w-auto h-[35px]"
          >
            publish
          </button>
         
        </div>
      </div>
    </div>
  );
}

export default NewPostPage;
