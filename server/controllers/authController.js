const asyncHandler = require("express-async-handler");
const { generateOtp, sendEmail } = require("../helpers/userUtils");
const bcrypt = require("bcrypt");
const pool = require("../config/db");

const loginSuccess = asyncHandler(async (req, res) => {
  try {
    // if req.user exist respond with the user login message and the user to the clien
    if (req.user) {
      res.status(200).json({ message: "user Login", user: req.user });
    } else {
      // if no user respond with a error message
      res.status(400).json({ message: "Not Authorized" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal server error");
  }
});

const logOut = asyncHandler(async (req, res, next) => {
  try {
    // Use the req.logout to log out from the site
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      // Redirect to the client login page
      res.redirect(`${process.env.CLIENT_URL}/login`);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal server error");
  }
});

const forgotPassword = asyncHandler(async (req, res) => {
  try {
    // Extracting email from the req.body
    const { email } = req.body;

    // Checking for the user associated with that email
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);

    // if no email found on db  return error message else generate otp and send mail
    if (result.rows.length == 0) {
      res.status(404).json("Enter a valid email");
    } else {
      // Generating otp
      const otp = generateOtp();

      // send mail
      sendEmail("ajeeshrs569@gmail.com", otp);
      res.status(200).json("Email sent");

      // storing email and otp in db
      const data = await pool.query(
        `INSERT INTO otps (email, otp, expires_at)
        VALUES ($1, $2, CURRENT_TIMESTAMP + INTERVAL '5 minutes')
        ON CONFLICT (email) DO UPDATE
        SET otp = $2, expires_at = CURRENT_TIMESTAMP + INTERVAL '5 minutes'`,
        [email, otp]
      );
    }
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal server error");
  }
});

const verifyOtp = asyncHandler(async (req, res) => {
  try {
    // Extracting otp and email from the req.body
    const { otp, email } = req.body;

    // Checking for the otps in db with the email and the otp
    const data = await pool.query(
      `SELECT * FROM otps WHERE email = $1 AND otp=$2`,
      [email, otp]
    );
    // if it returns a rowcount send success response to the client
    if (data.rowCount) {
      res.status(200).json("Your OTP has been successfully verified.");
    } else {
      res.status(404).json("Invalid OTP");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal server error");
  }
});

const resendOtp = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;

    // Generating otp
    const otp = generateOtp();

    // send mail
    sendEmail(email, otp);
    res.status(200).json("OTP has resent successfully");

    // storing email and otp in db
    const data = await pool.query(
      `INSERT INTO otps (email, otp, expires_at)
        VALUES ($1, $2, CURRENT_TIMESTAMP + INTERVAL '5 minutes')
        ON CONFLICT (email) DO UPDATE
        SET otp = $2, expires_at = CURRENT_TIMESTAMP + INTERVAL '5 minutes'`,
      [email, otp]
    );
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal server error");
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    // Hashing the password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // if email and hashedpassword exist update the row with new password associated with the email
    if (email && hashedPassword) {
      const data = await pool.query(
        "UPDATE users SET password = $1 WHERE email = $2",
        [hashedPassword, email]
      );

      // if it return a 0 for the rowcount response with a error message
      if (data.rowCount == 0) {
        res.status(400).json("Error occured in updating the password");
      } else {
        // else respond with a success message
        res.status(200).json("Password updated");
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal server error");
  }
});

module.exports = {
  loginSuccess,
  logOut,
  forgotPassword,
  verifyOtp,
  resendOtp,
  resetPassword,
};
