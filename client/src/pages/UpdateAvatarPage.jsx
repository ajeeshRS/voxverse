import { React, useRef, useState } from "react";
import { useNavigate } from "react-router";
import arrowLeftIcon from "../assets/Arrowleft.svg";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../helpers/urls";
import { notifyErrUpdateAvatar, notifyUpdateAvatar } from "../helpers/toastify";
import { ToastContainer } from "react-toastify";

function UpdateAvatarPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [imgData, setImgData] = useState(null);
  
  // state for user existence
  const user = useSelector((state) => state.userState.user);

  const userName = user.username;
  let userNameArray;
  let userFirstLetter;

  //  get the first letter and make that letter uppercase
  if (userName) {
    userNameArray = userName.split("");
    userFirstLetter = userNameArray[0].toUpperCase();
  }

  // if a user selected a image preview that  else the user has an avatar preview that
  const imagePath = imageSrc
    ? imageSrc
    : user.avatar && `${BASE_URL}/uploads/${user.avatar}`;

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setImgData(event.target.files[0]);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  
  const handleUpdateAvatar = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("image", imgData);

      const response = await axios.post(
        `${BASE_URL}/user/update-avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Including  token
            "Content-Type": "multipart/form-data",//multer will only work for this type of content
          },
        }
      );

      notifyUpdateAvatar();
    } catch (error) {
      notifyErrUpdateAvatar()
      console.log(error);
    }
  };

  return (
    <div>
      <div className="flex items-center pl-10 pt-10">
        <button onClick={() => navigate(-1)}>
          <img src={arrowLeftIcon} alt="left-arrow-btn" />
        </button>
        <h1 className="font-montserrat text-xl font-bold px-2">
          Update avatar
        </h1>
      </div>
      <div className="pt-20 w-full flex justify-center">
        <div className="items-center flex flex-col">
          <button className="sm:block p-2 font-poppins font-semibold text-lg rounded-full  bg-gray-200 w-20 h-20 hover:bg-gray-300 focus:outline-none">
            {imagePath ? (
              <img
                src={imagePath}
                alt="image-preview"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              userFirstLetter
            )}
          </button>
          <button
            onClick={handleButtonClick}
            className="w-full font-poppins font-semibold  mt-5 px-2 py-2 bg-black text-white rounded-md hover:bg-white hover:text-black border-2 hover:border-black transition-all duration-400"
          >
            Choose Image
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <button
            className=" w-full font-poppins font-semibold  mt-5 px-2 py-2 bg-black text-white rounded-md hover:bg-white hover:text-black border-2 hover:border-black transition-all duration-400"
            onClick={() => handleUpdateAvatar(imgData)}
          >
            Update
          </button>
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
        </div>
      </div>
    </div>
  );
}

export default UpdateAvatarPage;
