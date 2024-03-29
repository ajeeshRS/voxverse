import { Route, Routes } from "react-router";
import "./App.css";
import WelcomePage from "./pages/WelcomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NotFoundPage from "./pages/NotFoundPage";
import { useEffect, useState } from "react";
import { BASE_URL } from "./helpers/urls";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setUserState } from "./state/slices/UserStateSlice";
import { getHeaders } from "./helpers/getHeaders";
import PasswordResetPage from "./pages/PasswordResetPage";
import VerifyOtpPage from "./pages/VerifyOtpPage";
import NewPasswordPage from "./pages/NewPasswordPage";
import NewPostPage from "./pages/NewPostPage";
function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userState.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user with Google auth
        const googleResponse = await axios.get(
          `${BASE_URL}/auth/login/success`,
          {
            withCredentials: true,
          }
        );

        dispatch(setUser(googleResponse.data.user));
      } catch (error) {
        console.log("Error fetching user with Google auth:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  const isOtpSent = useSelector((state) => state.toggleState.value);

  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<PasswordResetPage />} />
      {isOtpSent && (
        <>
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/reset-password" element={<NewPasswordPage />} />
        </>
      )}

      <Route path="/new-post" element={<NewPostPage/>} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
