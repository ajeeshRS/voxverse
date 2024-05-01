const express = require("express");
const app = express();
const port = 3000;
const pool = require("./config/db");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middlewares/errorHandler");
const path = require("path")
const fs = require('fs')
require("dotenv").config();
require("./config/passport-setup");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const url = process.env.CLIENT_URL
// cors middleware options
app.use(
  cors({
    origin:url,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

// session  middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    resave: false,
    saveUninitialized: true,
  })
);
// initialising passportjs
app.use(passport.initialize());
app.use(passport.session());
// using error handler middleware
app.use(errorHandler);

// use this route for file uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// use /user prefix for all userRoutes
app.use("/user", userRoutes);

// use /auth prefix for all userRoutes
app.use("/auth", authRoutes);

// passportjs

// connect to database
pool.connect((err) => {
  if (err) {
    console.log("Some error occured during connection!",err);
  } else {
    console.log("Connected to postgresql ");
  }
});

// server listening
app.listen(port, () => {
  // const seedQuery = fs.readFileSync("./seedSchema.sql", { encoding: "utf8" });
  // // Execute the SQL script to seed the database
  // pool.query(seedQuery, (err, res) => {
  //   if (err) {
  //     console.error("Error seeding database:", err);
  //   } else {
  //     console.log("Seeding Completed!");
  //   }
  // });
  console.log(`Server running on port : ${port}`);
});
