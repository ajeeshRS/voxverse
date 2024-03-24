import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const notifyAccountCreation = () => {
  toast.success("Account Created", {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

const notifySuccessLogin = () => {
  toast.success("Login success", {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

const notifyEmailExistError = () => {
  toast.error("Email already exists", {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

const notifyOtpSent = () => {
  toast.success(
    "Your OTP (One-Time Password) has been successfully sent to your registered email.",
    {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
    }
  );
};

const notifyEmailError = (message) => {
  toast.error(message ? message : "Enter a valid email", {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

const notifyOtpResent = (message) => {
  toast.success(message ? message : "OTP resent success!", {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

const notifyOtpVerified= (message) => {
  toast.success(message ? message : "OTP verified.", {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};
const notifyOtpVerifyError= (message) => {
  toast.error(message ? message : "Invalid OTP.", {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

const notifyPasswordUpdation= (message) => {
  toast.success(message ? message : "Password updated.", {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};
const notifyPasswordUpdationErr= (message) => {
  toast.error(message ? message : "Error occured in updating the password .", {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

const notifyInvalidCredentials= () => {
  toast.error("Invalid credentials ", {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

const notifyBlogCreation= () => {
  toast.success("Published ", {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

const notifyBlogDraftCreation= () => {
  toast.success("Draft saved ", {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

export {
  notifyAccountCreation,
  notifyEmailExistError,
  notifySuccessLogin,
  notifyOtpSent,
  notifyEmailError,
  notifyOtpResent,
  notifyOtpVerified,
  notifyOtpVerifyError,
  notifyPasswordUpdation,
  notifyPasswordUpdationErr,
  notifyInvalidCredentials,
  notifyBlogCreation,
  notifyBlogDraftCreation
};
