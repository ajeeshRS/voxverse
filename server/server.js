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
require("dotenv").config();
require("./config/passport-setup");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
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

app.use(passport.initialize());
app.use(passport.session());
app.use(errorHandler);

app.use("/user", userRoutes);
app.use("/auth", authRoutes);

// passportjs

// connect to database
pool.connect((err) => {
  if (err) {
    console.log("Some error occured during connection!");
  } else {
    console.log("Connected to postgresql ");
  }
});

app.listen(port, () => {
  console.log(`Server running on port : ${port}`);
});
