const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'gamespring',
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = pool;

