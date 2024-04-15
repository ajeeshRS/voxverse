const pool = require("../config/db");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const {
  checkEmailExistence,
  sendFeedbackMail,
} = require("../helpers/userUtils");
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

// send feedback
const sendFeedback = asyncHandler(async (req, res) => {
  try {
    // Extracting feedback from the req.body
    const message = req.body.feedbackInput;

    // sending mail to the admin
    sendFeedbackMail(message);
    // on success respond with status code and message
    res.status(200).json("Feedback has been sent !");
  } catch (error) {
    console.log(error);
    // if any other error occurs respond with status code and error message
    res.status(500).json("Some internal error occured");
  }
});

// get user blogs
const getUserBlogs = asyncHandler(async (req, res) => {
  try {
    // fetching user name from the req.user
    const { username } = req.user;
    // query
    const query = `SELECT * FROM blogs WHERE user_id = $1`;
    // performing query
    const data = await pool.query(query, [username]);
    // if it returns any row then respond to user with the data
    if (data.rows) {
      res.status(200).json(data.rows);
    } else {
      // else respond with a 404 status code that blogs not found
      res.status(404).json("Blogs not found");
    }
  } catch (error) {
    console.log(error);
    // if any other error occurs respond with error message and status code
    res.status(500).json("Some internal error occured");
  }
});

// get user drafts
const getUserDrafts = asyncHandler(async (req, res) => {
  try {
    // fetching user name from the req.user
    const { email } = req.user;
    // query
    const query = `SELECT * FROM blog_drafts WHERE user_id = $1`;
    // performing query
    const data = await pool.query(query, [email]);
    // if it returns any row then respond to user with the data
    if (data.rows) {
      // console.log(data.rows);
      res.status(200).json(data.rows);
    } else {
      // else respond with a 404 status code that blogs not found
      res.status(404).json("Drafts not found");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("Some internal error occured");
  }
});

// delete draft with id
const deleteDraftById = asyncHandler(async (req, res) => {
  try {
    // extracting id from the request params
    const id = req.params.id;
    console.log(id);
    // query
    const query = `DELETE FROM blog_drafts WHERE id = $1`;
    // performing query
    const data = await pool.query(query, [id]);
    if (data.rowCount > 0) {
      res.status(200).json("Draft deleted success");
    } else {
      res.status(404).json("Draft not found");
    }
  } catch (error) {
    console.log(error);
    // if any error occurs respond with status code and error message
    res.status(500).json("Some internal error occured");
  }
});

// delete story by id
const deleteStoryById = asyncHandler(async (req, res) => {
  try {
    // extracting id from the request params
    const id = req.params.id;
    console.log(id);
    // query
    const query = `DELETE FROM blogs WHERE id = $1`;

    // performing query
    const data = await pool.query(query, [id]);
    if (data.rowCount > 0) {
      res.status(200).json("Blog deleted success");
    } else {
      res.status(400).json("Error in deleting the blog");
    }
  } catch (error) {
    console.log(error);
    // if any error occurs respond with status code and error message
    res.status(500).json("Some internal error occured");
  }
});

// function to update blogs
const updateBlogs = asyncHandler(async (req, res) => {
  try {
    // getting id from params
    const id = req.params.id;
    // Extracting details from body
    const { title, content, tags } = req.body;
    // Extracting image from the req.file
    const image = req.file;

    // Updating  blog
    const data = await pool.query(
      `UPDATE blogs SET title=$1,content=$2,tags=$3,image_filename=$4,image_path=$5,image_destination=$6 WHERE id = $7`,
      [title, content, tags, image.filename, image.path, image.destination, id]
    );
    // if updated respond with proper success message
    if (data.rowCount > 0) {
      res.status(200).json("Blog updated");
    } else {
      res.status(400).json("Error in updating blog");
    }
  } catch (error) {
    console.log(error);
    // if any other error occurs respond with error message and status code
    res.status(500).json("Some internal error occured");
  }
});

// function to add to bookmarks
const addBookmark = asyncHandler(async (req, res) => {
  try {
    // getting id from url
    const id = req.params.id;
    // getting user from req
    const user = req.user;
    // console.log(id, user);
    // checking for blog in db
    const row = await pool.query(`SELECT * FROM Bookmark WHERE BlogID=$1`, [
      id,
    ]);
    // if no row where found add to bookmark
    if (row.rowCount == 0) {
      const data = await pool.query(
        `INSERT INTO Bookmark (UserID,BlogID) VALUES($1,$2)`,
        [user.email, id]
      );
      // if any row is affected  respond with success status code and message
      if (data.rowCount > 0) {
        console.log("added");
        res.status(200).json("Added to bookmarks");
      } else {
        res.status(400).json("Error in adding to bookmarks");
      }
      // if it is in the bookmark already respond with proper status code and message
    } else {
      res.status(409).json("Already bookmarked");
    }
  } catch (error) {
    console.log(error);
    // if any other error occurs respond with error status code and message
    res.status(500).json("Internal server error");
  }
});

// function to remove from bookmarks
const removeFromBookmarks = asyncHandler(async (req, res) => {
  try {
    // getting id from the url
    const id = req.params.id;
    // getting user for the request
    const user = req.user;
    // getting the blog with id
    const exist = await pool.query(`SELECT * FROM Bookmark WHERE BlogID=$1`, [
      id,
    ]);
    if (exist.rowCount) {
      // if it exist remove from db
      const data = await pool.query(
        `DELETE FROM Bookmark WHERE BlogID=$1 AND UserID=$2`,
        [id, user.email]
      );
      // if it return any row respond with status code and message
      if (data.rowCount > 0) {
        res.status(200).json("Removed from bookmarks");
        console.log("removed");
      } else {
        // respond with error status code and message
        res.status(400).json("Error in removing from bookmarks");
      }
    }
  } catch (error) {
    console.log(error);
    // if any other error occurs respond with error status code and message
    res.status(500).json("Internal server error");
  }
});

// function to check blog is bookmarked or not
const checkBookmark = asyncHandler(async (req, res) => {
  try {
    // getting id from url
    const id = req.params.id;
    console.log(id);
    // getting the blog from the bookmark
    const data = await pool.query(`SELECT * FROM Bookmark WHERE BlogID =$1`, [
      id,
    ]);
    // console.log(data.rows)
    // if it is in the bookmark then respond true
    if (data.rowCount > 0) {
      res.status(200).json(true);
      // else pass false
    } else {
      res.status(404).json(false);
    }
  } catch (error) {
    console.log(error);
    // if any other erro occurs respond with error status code and  message
    res.status(500).json("Internal server error");
  }
});

// function to get all the bookmarks
const getBookmarks = asyncHandler(async (req, res) => {
  try {
    // getting user from the request
    const user = req.user;
    // console.log(user)
    // getting the blogs for the user from the bookmarks
    const data = await pool.query(`SELECT * FROM Bookmark WHERE UserID = $1`, [
      user.email,
    ]);

    // if it returns any rows respond with the data
    if (data.rowCount) {
      res.status(200).json(data.rows);
    } else {
      // responding with 404 error code
      res.status(404).json("No bookmark where found");
      console.log("Couldn't fetch docs");
    }
  } catch (error) {
    console.log(error);
    // if any other error occurs respond with error status code and message
    res.status(500).json("Internal server error");
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
};
