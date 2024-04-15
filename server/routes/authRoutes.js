const router = require("express").Router();
const passport = require("passport");
const {
  loginSuccess,
  logOut,
  forgotPassword,
  verifyOtp,
  resendOtp,
  resetPassword,
} = require("../controllers/authController");

// passport js auth route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// passport js callback route
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:5173/",
    failureRedirect: "http://localhost:5173/login",
  })
);

// login success route
router.get("/login/success", loginSuccess);

// logout route
router.get("/logout", logOut);

// Forgot password route
router.post("/forgot-password", forgotPassword);

// verify otp
router.post("/verify-otp", verifyOtp);

// resend otp
router.post("/resend-otp", resendOtp);

// update password
router.put("/reset-password", resetPassword);
module.exports = router;
