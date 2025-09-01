require("dotenv").config();
const knex = require("knex");

const db = knex({
  client: "mysql2",   
  connection: {
    host: process.env.DBHOST || "localhost",
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBNAME,
  },
  pool: { min: 2, max: 10 },
});

module.exports = db;
