const pool = require("../config/db");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Function to check email existence
const checkEmailExistence = async (email) => {
  try {
    // query
    const query = "SELECT COUNT(*) FROM users WHERE email = $1";
    const data = await pool.query(query, [email]);
    const count = parseInt(data.rows[0].count);
    if (count > 0) {
      return true;
    }
  } catch (error) {
    console.error("Error checking email existence:", error);
    throw error;
  }
};

// function to generate a 5 digit otp
const generateOtp = () => {
  const otpLength = 5;
  const otp = crypto.randomBytes(otpLength).readUintBE(0, otpLength) % 100000;
  return otp.toString().padStart(otpLength, "0");
};

// function to send mail
const sendEmail = (email, otp) => {
  try {
    // Create a transporter using SMTP transport
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "me.ajeesh7979@gmail.com",
        pass: process.env.APP_SECRET,
      },
      secure: false,
    });

    // Email data
    const mailOptions = {
      from: "me.ajeesh7979@gmail.com",
      to: email,
      subject: "This is your one-time-password",
      text: otp,
      html: `
        <h1>OTP for Verification</h1>
        <p>Your OTP (One Time Password) for verification is: <strong>${otp}</strong>.</p>
        <p>Please use this OTP to complete the verification process.</p>
        <p>Valid for only 5 minutes.</p>
        <p style="font-style: italic;">This is an automatically generated email. Please do not reply.</p>
    `,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};





// Export modules
module.exports = { checkEmailExistence, generateOtp,sendEmail };
