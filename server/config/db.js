require("dotenv").config();
const { Pool } = require("pg");

// const pool = new Pool({
//   host: "localhost",
//   port: 5432,
//   database: "voxverse",
//   user: "postgres",
//   password:process.env.POSTGRESQL_SECRET,
// });
const pool = new Pool({
  connectionString:process.env.DBURL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
