import { Route, Routes } from "react-router";
import "./App.css";
import WelcomePage from "./pages/WelcomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NotFoundPage from "./pages/NotFoundPage";
import { useCallback, useEffect, useState } from "react";
import { BASE_URL } from "./helpers/urls";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setUserState } from "./state/slices/UserStateSlice";
import { getHeaders } from "./helpers/getHeaders";
import PasswordResetPage from "./pages/PasswordResetPage";
import VerifyOtpPage from "./pages/VerifyOtpPage";
import NewPasswordPage from "./pages/NewPasswordPage";
import NewPostPage from "./pages/NewPostPage";
import AllArticles from "./components/AllArticles";
import ViewArticle from "./pages/ViewArticle";
import { setAllBlogs } from "./state/slices/AllBlogSlice";
import UserStories from "./pages/UserStories";
import EditPostPage from "./pages/EditPostPage";
import BookmarkPage from "./pages/BookmarkPage";
import UserProfilePage from "./pages/UserProfilePage";
import UpdateprofilePage from "./pages/UpdateprofilePage";
import UpdateAvatarPage from "./pages/UpdateAvatarPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import SearchPage from "./pages/SearchPage";
function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userState.user);
  const googleId = user.google_id;

  useEffect(() => {
    const fetchAllArticles = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/get/all-blogs`);
        dispatch(setAllBlogs(response.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllArticles();
  }, []);

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
        // console.log(googleResponse.data)
        localStorage.setItem("token", googleResponse.data.token);

        dispatch(setUser(googleResponse.data.user));
      } catch (error) {
        // console.log("Error fetching user with Google auth:", error);
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

      <Route path="/new-post" element={<NewPostPage />} />
      <Route path="/articles" element={<AllArticles />} />
      <Route path="/articles/:name/:id" element={<ViewArticle />} />
      <Route
        path="/my-stories"
        element={
          Object.keys(user).length !== 0 ? <UserStories /> : <NotFoundPage />
        }
      />
      <Route path="/my-stories/edit/:id" element={<EditPostPage />} />
      <Route
        path="/bookmarks"
        element={
          Object.keys(user).length !== 0 ? <BookmarkPage /> : <NotFoundPage />
        }
      />
      <Route
        path="/profile"
        element={
          Object.keys(user).length !== 0 ? (
            <UserProfilePage />
          ) : (
            <NotFoundPage />
          )
        }
      />
      <Route
        path="/update-profile"
        element={
          Object.keys(user).length !== 0 ? (
            <UpdateprofilePage />
          ) : (
            <NotFoundPage />
          )
        }
      />
      <Route
        path="/update-avatar"
        element={
          Object.keys(user).length !== 0 ? (
            <UpdateAvatarPage />
          ) : (
            <NotFoundPage />
          )
        }
      />

      <Route
        path="/change-password"
        element={googleId ? <NotFoundPage /> : <ChangePasswordPage />}
      />

      <Route path="/search/:query" element={<SearchPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
