const errorHandler = require('../handlers/error_handler');
const users = require('./Models/users');
const mysql = require("mysql")

const dbConnect = () => {
    const dbConfig = {
        host: 'localhost',
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    };
    const sql = mysql.createConnection(dbConfig);
    sql.connect((err) => {
        if (err) {
            errorHandler(err)
            return;
        }
        console.log('Connected to MySQL database');
        // console.log('Connected to MySQL database as id ' + sql.threadId);
        const createUserTableQuery = users;
        sql.query(createUserTableQuery, (error, results, fields) => {
            if (error) {
                console.error('Error creating users table: ' + error.message);
            }
        });
    });
}

module.exports = dbConnect;