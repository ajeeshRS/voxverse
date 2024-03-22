const pool = require("../config/db");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const { checkEmailExistence } = require("../helpers/userUtils");
const jwt = require("jsonwebtoken");

// Creating new user
const registerUser = asyncHandler(async (req, res) => {
  try {
    // Validate input
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
      return res.status(400).json("All fields are mandatory");
    }
    // Checking email existence
    const emailExists = await checkEmailExistence(email);
    if (emailExists) {
      console.log("email exists");
      return res.status(400).json("Email already exists");
    }

    //  Hashing password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creating user
    const query =
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)";
    const data = await pool.query(query, [userName, email, hashedPassword]);

    if (data.rowCount === 1) {
      // User creation successful
      console.log(data.rowCount);
      return res.status(201).json("User created successfully");
    } else {
      // If no rows were affected, the insertion failed
      throw new Error("User creation failed");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json("Internal Server Error");
  }
});

const userLogin = asyncHandler(async (req, res) => {
  try {
    // checking user inputs
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json("All fields are mandatory");
    }
    // Checking user existence
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const userPassword = user.rows[0].password;
    // if user and  the passwords are matching generate token and send to the client
    if (user && (await bcrypt.compare(password, userPassword))) {
      const accessToken = jwt.sign(
        {
          user: {
            username: user.rows[0].username,
            email: user.rows[0].email,
          },
        },
        process.env.JWT_SECRET,
        { expiresIn: "3d" }
      );
      res.status(200).json({ accessToken: accessToken });
    } else {
      res.status(401).json("Email or password is not valid");
      throw new Error("Email or password is not valid");
    }
  } catch (err) {
    console.log(err);
  }
});

//Get user info
const getUserInfo = asyncHandler(async (req, res) => {
  try {
    // Extracting user from the request
    const user = req.user;

    // if the user exist send the user to the client
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json("error fetching in user details");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("some internal error occured!");
  }
});

module.exports = { registerUser, userLogin, getUserInfo };
