const express = require("express");
const {
  registerUser,
  userLogin,
  getUserInfo,
  newBlog,
  newDraft,
  getLatestBlogs,
  getAllBlogs,
  sendFeedback,
  getUserBlogs,
  getUserDrafts,
  deleteDraftById,
  deleteStoryById,
  updateBlogs,
  addBookmark,
  removeFromBookmarks,
  checkBookmark,
  getBookmarks,
  updateProfile,
  updateAvatar,
  changePassword,
  searchBlog,
} = require("../controllers/userController");
const router = express.Router();
const validateToken = require("../middlewares/tokenValidator");
const multer = require("multer");
const path = require("path");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // save uploaded files to the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Controller functions for handling single file upload
const uploadSingle = upload.single("image");

// signup route
router.post("/signup", registerUser);

// login route
router.post("/login", userLogin);

// get user details route
router.get("/get", validateToken, getUserInfo);

// new blog
router.post(
  "/new-blog",
  validateToken,
  (req, res, next) => {
    // to check whether the middleware is invoked or not
    // console.log("middleware is invoked");
    uploadSingle(req, res, (err) => {
      if (err) {
        // Handle the error
        res.status(500);
        console.log(err);
        throw new Error("file upload failed");
      }
      // Continue to the next middleware
      next();
    });
  },
  newBlog
);

// new draft
router.post(
  "/new-draft",
  validateToken,
  (req, res, next) => {
    // to check whether the middleware is invoked or not
    // console.log("middleware is invoked");
    uploadSingle(req, res, (err) => {
      if (err) {
        // Handle the error
        res.status(500);
        console.log(err);
        throw new Error("file upload failed");
      }
      // Continue to the next middleware
      next();
    });
  },
  newDraft
);

// get latest blogs route
router.get("/get/latest-blogs", getLatestBlogs);

// get the all blogs route
router.get("/get/all-blogs", getAllBlogs);

// send feedback route
router.post("/send-feedback", sendFeedback);

// get user blogs
router.get("/get/user-blogs", validateToken, getUserBlogs);

// get user drafts
router.get("/get/user-drafts", validateToken, getUserDrafts);

// delete draft by id
router.delete("/delete-draft/:id", validateToken, deleteDraftById);

// delete story by id
router.delete("/delete-story/:id", validateToken, deleteStoryById);

// update story by id
router.put(
  "/update-blog/:id",
  validateToken,
  (req, res, next) => {
    // to check whether the middleware is invoked or not
    // console.log("middleware is invoked");
    uploadSingle(req, res, (err) => {
      if (err) {
        // Handle the error
        res.status(500);
        console.log(err);
        throw new Error("file upload failed");
      }
      // Continue to the next middleware
      next();
    });
  },
  updateBlogs
);

// add bookmark
router.post("/bookmark/add/:id", validateToken, addBookmark);

// remove from bookmarks
router.delete("/bookmark/delete/:id", validateToken, removeFromBookmarks);

// check bookmark for blog
router.get("/bookmark/get/:id", validateToken, checkBookmark);

// Get all bookmark
router.get("/get/bookmarks", validateToken, getBookmarks);

// update profile
router.post("/update-profile", validateToken, updateProfile);

// update avatar
router.post(
  "/update-avatar",
  validateToken,
  (req, res, next) => {
    // to check whether the middleware is invoked or not
    // console.log("middleware is invoked");
    uploadSingle(req, res, (err) => {
      if (err) {
        // Handle the error
        res.status(500);
        console.log(err);
        throw new Error("file upload failed");
      }
      // Continue to the next middleware
      next();
    });
  },
  updateAvatar
);

// change password
router.put("/change-password", validateToken, changePassword);

// search blog
router.get("/blogs/search/:searchTerm",searchBlog)

module.exports = router;
