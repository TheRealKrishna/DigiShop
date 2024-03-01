const errorHandler = require('../handlers/error_handler');
const schema = require('./Models/schema');
const mysql = require("mysql")

const dbConnect = () => {
    const dbConfig = {
        host: 'localhost',
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        multipleStatements: true,
    };
    const sql = mysql.createConnection(dbConfig);
    sql.connect((err) => {
        if (err) {
            errorHandler(err)
            return;
        }
        console.log('Connected to MySQL database');
        // console.log('Connected to MySQL database as id ' + sql.threadId);
        const createTablesQuery = schema;
        sql.query(createTablesQuery, (error, results, fields) => {
            if (error) {
                errorHandler(error)
                return;
            }
        });
    });
}

module.exports = dbConnect;