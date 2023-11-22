const mysql = require("mysql2/promise");

const connectionConfig = {
    host: "localhost",
    user: "u279407219_Tgsass",
    password: "DbadminTg200986!",
    database: "u279407219_banco_gpc",
    port: 3307,
};

const pool = mysql.createPool(connectionConfig);

module.exports = pool;