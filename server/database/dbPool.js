const mysql = require('mysql');

const dbConfig = {
    host: 'localhost',
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    multipleStatements: true,
};

const dbPool = mysql.createPool(dbConfig)

module.exports = dbPool;