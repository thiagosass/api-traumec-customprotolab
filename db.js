const mysql = require("mysql2/promise");

const connectionConfig = {
    host: "localhost",
    user: "Tgsass",
    password: "DbadminTg200986!",
    database: "banco_gpc",
    port: 3307,
};

const pool = mysql.createPool(connectionConfig);

module.exports = pool;