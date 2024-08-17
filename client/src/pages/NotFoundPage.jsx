import React from "react";
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="w-full h-[90vh] flex justify-center items-center px-10">
      <div className="text-center">
        <h1 className="text-[#262626] font-sans font-extrabold text-3xl pb-5">
          404
        </h1>
        <h2 className="font-poppins font-semibold text-xl text-gray-600 ">
          Page Not found
        </h2>
        <p className="font-poppins text-md text-gray-500 font-normal pt-3">
          We&apos;re sorry,the page you requested could not be found!
        </p>
        <button className="w-[150px] h-10 mt-4 rounded-lg bg-black text-white hover:bg-[#262626] transition duration-500">
          <Link to="/">Go back to home</Link>
        </button>
      </div>
    </div>
  );
}

export default NotFoundPage;
