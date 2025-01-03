const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const pool = new Pool({
  user: "admin",
  password: process.env.CONNECTION_PASSWORD,
  host: "localhost",
  port: 5432,
  database: "sharing_one_braincell",
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
