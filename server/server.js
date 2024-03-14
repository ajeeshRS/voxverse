const express = require("express");
const app = express();
const port = 3000;
const pool = require("./db");
const userRoutes = require("./routes/userRoutes");
require("dotenv").config()
app.use(express.json());
app.use("/user", userRoutes);

// connect to database
pool.connect((err) => {
  if (err) {
    console.log("some error occured during connection!");
  } else {
    console.log("connected to psql");
  }
});

app.listen(port, () => {
  console.log(`server running on port : ${port}`);
});
