const mysql = require('mysql');
require('dotenv').config(); // Loading .env to process.env

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

exports.getPool = () => pool;

exports.getConnection = callback => pool.getConnection(callback);

// module.exports = {
//   getPool: () => pool,
//   getConnection: callback => pool.getConnection(callback),
// };
