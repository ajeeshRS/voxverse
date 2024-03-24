import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { BASE_URL } from "../helpers/urls";
import { getHeaders } from "../helpers/getHeaders";
import {
  notifyBlogCreation,
  notifyBlogDraftCreation,
} from "../helpers/toastify";
import { ToastContainer } from "react-toastify";
function NewPostPage() {
  // React hook form
  const { register, handleSubmit, formState, reset } = useForm();

  // tags
  const [tags, setTags] = useState([]);

  // tag input handle state
  const [tagInput, setTagInput] = useState("");

  // To handle tag input change
  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  // To add taginput when pressing enter key
  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };
  // To handle tag removal
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
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
      // sending data to the backend
      const res = await axios.post(`${BASE_URL}/user/new-blog`, formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Including  token
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.status == 200) {
        notifyBlogCreation();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // on submit function(draft blog)

  const submitDraft = async (data, e) => {
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
      // sending data to the backend
      const res = await axios.post(`${BASE_URL}/user/new-draft`, formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Including  token
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.status == 200) {
        notifyBlogDraftCreation();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <nav className="w-full h-20 flex justify-around items-center fixed  z-10 bg-white">
        <div className="">
          <p className="text-[#36453B] text-xl font-bold  font-josefin w-10">
            VoxVerse
          </p>
        </div>
        <div className="flex  ">
          <button
            type="submit"
            onClick={handleSubmit((data, e) => submitDraft(data, e))}
            className="mx-5 rounded-full text-white px-2 bg-red-500 hover:bg-red-600 text-sm w-[100px] h-[35px]"
          >
            Save draft
          </button>
          <button
            type="submit"
            onClick={handleSubmit((data, e) => onSubmit(data, e))}
            disabled={formState.isSubmitting}
            className="mx-5 rounded-full text-white px-2 bg-black hover:bg-[#262626] text-sm w-[100px] h-[35px]"
          >
            publish
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
        </div>
      </nav>

      <div className="w-full flex  flex-col items-center pt-28">
        <div className="flex flex-col items-start">
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
                  <button
                    onClick={() => handleRemoveTag(tag)}
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
        <button
          onClick={() => {
            console.log("reseting....");

            reset();
          }}
        >
          reset form
        </button>
      </div>
    </div>
  );
}

export default NewPostPage;
