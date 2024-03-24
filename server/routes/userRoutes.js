const express = require("express");
const {
  registerUser,
  userLogin,
  getUserInfo,
  newBlog,
  newDraft,
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

router.post("/signup", registerUser);
router.post("/login", userLogin);
router.get("/get", validateToken, getUserInfo);
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

module.exports = router;
