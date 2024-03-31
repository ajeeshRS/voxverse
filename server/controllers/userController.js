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

// user login
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

// creating new blog
const newBlog = asyncHandler(async (req, res) => {
  try {
    // getting the details from the req.body
    const { title, content, tags } = req.body;

    // getting the image from the req.file
    const image = req.file;

    // getting the user from the req.user
    const user = req.user;

    // console.log(user);

    // creating  new blog
    const data = await pool.query(
      `INSERT INTO blogs (user_id,title,content,tags,image_filename,image_path,image_destination) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [
        user.username,
        title,
        content,
        tags,
        image.filename,
        image.path,
        image.destination,
      ]
    );

    // if it return any rows then the blog is added
    if (data.rowCount > 0) {
      res.status(200).json("Blog added");
      // else return an error message with status code
    } else {
      res.status(400).json("Error in saving blog");
    }
  } catch (error) {
    // send error message and status code on any other errors
    console.log(error);
    res.status(500).json("some internal error occured!");
  }
});

// creating draft
const newDraft = asyncHandler(async (req, res) => {
  try {
    // getting the details from the req.body
    const { title, content, tags } = req.body;

    // getting image from the req.file
    const image = req.file;

    // getting user form the req.user
    const user = req.user;

    console.log(user);

    // creating draft
    const data = await pool.query(
      `INSERT INTO blog_drafts (user_id,title,content,tags,image_filename,image_path,image_destination) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [
        user.email,
        title,
        content,
        tags,
        image.filename,
        image.path,
        image.destination,
      ]
    );

    // if it return any rows then the blog is added
    if (data.rowCount > 0) {
      res.status(200).json("Draft saved");
    } else {
      // else return an error message with status code

      res.status(400).json("Error in saving the draft");
    }
  } catch (err) {
    console.log(err);
    // send error message and status code on any other errors

    res.status(500).json("Some internal error occured");
  }
});

// fetching latest 3 blogs from the db
const getLatestBlogs = asyncHandler(async (req, res) => {
  try {
    // query
    const query = "SELECT * FROM blogs ORDER BY id DESC LIMIT 3;";
    // fetching
    const data = await pool.query(query);
    // if it returns any row then respond with the result with status code
    if (data.rowCount > 0) {
      res.status(200).json(data.rows);
    }
  } catch (err) {
    // if any other error occurs then respond with status 500 and error message
    console.log(err);
    res.status(500).json("Some internal error occured");
  }
});

// fetching all blogs from the db
const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    // query
    const query = "SELECT * FROM blogs;";
    // fetching
    const data = await pool.query(query);
    // if it returns any rows then respond with result and status code
    if (data.rowCount > 0) {
      res.status(200).json(data.rows);
    }
  } catch (err) {
    console.log(err);
    // if any other error occurs then respond with status 500 and error message
    res.status(500).json("Some internal error occured");
  }
});

module.exports = {
  registerUser,
  userLogin,
  getUserInfo,
  newBlog,
  newDraft,
  getLatestBlogs,
  getAllBlogs,
};
