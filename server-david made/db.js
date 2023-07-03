import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  connectionLimit: 5, //mysql connection pool length
  debug: false,
  timezone: "Z",
});

function getSqlConnection() {
  return pool.getConnectionAsync().disposer(function (connection) {
    console.log("Releasing connection back to pool");
    connection.release();
  });
}

getSqlConnection();
function querySql(query, params) {
  return Promise.using(getSqlConnection(), function (connection) {
    console.log("Got connection from pool");
    if (typeof params !== "undefined") {
      return connection.queryAsync(query, params);
    } else {
      return connection.queryAsync(query);
    }
  });
}

module.exports = {
  getSqlConnection,
  querySql,
};
