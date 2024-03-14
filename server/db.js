const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  port: 5432,
  database: "voxverse",
  user: "postgres",
  password: process.env.POSTGRESQL_SECRET,
});

module.exports = pool;
