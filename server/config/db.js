require("dotenv").config();
const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

// const pool = new Pool({
//   host: "localhost",
//   port: 5432,
//   database: "voxverse",
//   user: "postgres",
//   password:process.env.POSTGRESQL_SECRET,
// });
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_SECRET,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: "defaultdb",
  ssl: {
    rejectUnauthorized: true,
    ca: fs
      .readFileSync(path.resolve(__dirname, process.env.CA_PATH || "./ca.pem"))
      .toString(),
  },
});

module.exports = pool;
