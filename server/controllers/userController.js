const pool = require("../config/db");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const {
  checkEmailExistence,
  sendFeedbackMail,
} = require("../helpers/userUtils");
const jwt = require("jsonwebtoken");

const registerUser = asyncHandler(async (req, res) => {
  try {
    // Validate input
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
      return res.status(400).json("All fields are mandatory");
    }

    const emailExists = await checkEmailExistence(email);
    if (emailExists) {
      console.log("email exists");
      return res.status(400).json("Email already exists");
    }

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

const getUserInfo = asyncHandler(async (req, res) => {
  try {
    const user = req.user;

    const data = await pool.query(
      `SELECT username,email,bio,avatar,google_id FROM users WHERE email=$1`,
      [user.email]
    );
    // if the user exist send the user to the client
    if (data.rowCount > 0) {
      const formatedData = {
        username: data.rows[0].username,
        bio: data.rows[0].bio,
        email: data.rows[0].email,
        avatar: data.rows[0].avatar,
        google_id:data.rows[0].google_id?data.rows[0].google_id:null
      };

      res.status(200).json(formatedData);
    } else {
      res.status(404).json("error fetching in user details");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("some internal error occured!");
  }
});

const newBlog = asyncHandler(async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    const image = req.file;

    // getting the user from the req.user
    const user = req.user;

    // console.log(user);

    // creating  new blog
    const data = await pool.query(
      `INSERT INTO blogs (user_id,title,content,tags,image_filename,image_path,image_destination,email) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [
        user.username,
        title,
        content,
        tags,
        image.filename,
        image.path,
        image.destination,
        user.email
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
    console.log(error);
    res.status(500).json("some internal error occured!");
  }
});

const newDraft = asyncHandler(async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    const image = req.file;

    // getting user form the req.user
    const user = req.user;

    // console.log(user);

    // creating draft
    const data = await pool.query(
      `INSERT INTO blog_drafts (user_id,title,content,tags,image_filename,image_path,image_destination,email) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [
        user.email,
        title,
        content,
        tags,
        image.filename,
        image.path,
        image.destination,
        user.email
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
    console.log(err);
    res.status(500).json("Some internal error occured");
  }
});

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
    res.status(500).json("Some internal error occured");
  }
});

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
    res.status(500).json("Some internal error occured");
  }
});

const getUserBlogs = asyncHandler(async (req, res) => {
  try {
    const { username, email } = req.user;
    console.log(email)
    // query
    const query = `SELECT * FROM blogs WHERE email = $1`;
    // performing query
    const data = await pool.query(query, [email]);
    // if it returns any row then respond to user with the data
    console.log(data.rows)
    if (data.rows) {
      res.status(200).json(data.rows);
    } else {
      // else respond with a 404 status code that blogs not found
      res.status(404).json("Blogs not found");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("Some internal error occured");
  }
});

const getUserDrafts = asyncHandler(async (req, res) => {
  try {
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

const updateBlogs = asyncHandler(async (req, res) => {
  try {
    // getting id from params
    const id = req.params.id;
    const { title, content, tags } = req.body;
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

const addBookmark = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
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
    } else {
      res.status(409).json("Already bookmarked");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal server error");
  }
});

const removeFromBookmarks = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
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
    res.status(500).json("Internal server error");
  }
});

const checkBookmark = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    // console.log(id);
    // getting the blog from the bookmark
    const data = await pool.query(`SELECT * FROM Bookmark WHERE BlogID =$1`, [
      id,
    ]);
    // console.log(data.rows)
    // if it is in the bookmark then respond true
    if (data.rowCount > 0) {
      res.status(200).json(true);
    } else {
      res.status(404).json(false);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal server error");
  }
});

const getBookmarks = asyncHandler(async (req, res) => {
  try {
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
    res.status(500).json("Internal server error");
  }
});

const updateProfile = asyncHandler(async (req, res) => {
  try {
    const { username, bio } = req.body;
    const { email } = req.user;
    console.log(req.user)
    // performing query
    const data = await pool.query(`SELECT * FROM users WHERE email=$1`, [
      email,
    ]);
    // if it returns any row update the row with new info
    if (data.rowCount > 0) {
      if (username || bio) {
        const data = await pool.query(
          `UPDATE users SET username=$1 WHERE email=$2`,
          [username, email]
        );
        const response = await pool.query(
          `UPDATE users SET bio=$1 WHERE email=$2`,
          [bio, email]
        );
        // also updates the username in the blogs db
        const result = await pool.query(
          `UPDATE blogs SET user_id=$1 WHERE email=$2`,
          [username, email]
        );

        if (data.rowCount > 0 || response.rowCount > 0) {
          res.status(200).json("Details updated");
        } else {
          res.status(400).json("Couldn't update Details");
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal server error");
  }
});

const updateAvatar = asyncHandler(async (req, res) => {
  try {
    const image = req.file;
    const { email } = req.user;
    // performing query
    const data = await pool.query(
      `UPDATE users SET avatar=$1 WHERE email=$2 `,
      [image.filename, email]
    );
    // if it returns any row respond with message
    if (data.rowCount > 0) {
      res.status(200).json("Avatar updated");
    } else {
      res.status(400).json("Unable to update avatar");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal server error");
  }
});

const changePassword = asyncHandler(async (req, res) => {
  try {
    const { currentPassword, password } = req.body;
    const user = req.user;

    // checking db for the user
    const data = await pool.query(`SELECT * FROM users WHERE email=$1`, [
      user.email,
    ]);

    if (!data.rowCount > 0) {
      console.log("user not found");
      res.status(404).json("User not found");
    }

    // comparing the passwords
    if (!(await bcrypt.compare(currentPassword, data.rows[0].password))) {
      console.log("passwords not matches");
      return res.status(401).json("Passwords doesn't match");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // updates the current password with new hashed password
    const response = await pool.query(`UPDATE users SET Password=$1`, [
      hashedPassword,
    ]);

    if (!response.rowCount > 0) {
      return res.status(400).json("Unable to update password");
    } else {
      res.status(200).json("Password updated successfully");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal server error");
  }
});

const searchBlog = asyncHandler(async (req, res) => {
  try {
    const searchTerm = req.params.searchTerm;

    const sqlQuery = `
  SELECT * FROM blogs
  WHERE content ILIKE $1
  OR title ILIKE $1
  OR tags @> ARRAY[$1]::text[];`;
  
    // searching
    const data = await pool.query(sqlQuery, [`%${searchTerm}%`]);
    if (data.rowCount > 0) {
      // sending results to the client
      res.status(200).json(data.rows);
    } else {
      res.status(404).json("Not found");
    }
  } catch (error) {
    console.log(error);
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
  updateProfile,
  updateAvatar,
  changePassword,
  searchBlog,
};
