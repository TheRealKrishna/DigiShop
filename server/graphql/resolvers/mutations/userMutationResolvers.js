const dbPool = require("../../../database/dbPool");
const errorHandler = require("../../../handlers/error_handler")
const validator = require("email-validator");
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET

const Mutation = {
    createAccount: async (parent, { username, email, password }) => {
        return new Promise(async (resolve, reject) => {

            // basic checks
            if (username.length < 5) {
                return reject("Username must have atleast 5 characters!")
            }
            if (!/^[a-zA-Z0-9_]+$/.test(username)) {
                return reject("Username can only contain Alphabet, Number And Underscore!")
            }
            if (password.length < 8) {
                return reject("Password must have atleast 8 characters!")
            }
            if (!validator.validate(email)) {
                return reject("Please enter a valid email address!")
            }

            // checking if user already exist with that email or username
            dbPool.query(`SELECT * FROM users WHERE email = '${email}' OR username= '${username}'`, async (error, results) => {
                if (error) {
                    errorHandler(error);
                    return reject("An Internal Server Error Occurred!");
                }
                if (results && results.length > 0) {
                    if (results[0].username === username) {
                        return reject("A user already exists with that username!");
                    }
                    else if (results[0].email === email) {
                        return reject("A user already exists with that email!");
                    }
                }
                else {

                    // encrypting password
                    const securePassword = bcrypt.hashSync(password, 10);

                    // creating a user with those credentials                    
                    dbPool.query(
                        `INSERT INTO users (username, email, password) VALUES ('${username}', '${email}', '${securePassword}')`
                        , (error, results) => {
                            if (error) {
                                errorHandler(error);
                                return reject("An Internal Server Error Occurred!");
                            }
                            dbPool.query(
                                `SELECT id, username, email FROM users WHERE username = '${username}' OR email = '${email}'`, (error, results) => {
                                    if (error) {
                                        errorHandler(error);
                                        return reject("An Internal Server Error Occurred!");
                                    }
                                    
                                    // making a JWT
                                    const auth_token = jwt.sign({ id: results.insertId }, JWT_SECRET)

                                    resolve({ ...results[0], auth_token })
                                })
                        })
                }
            })
        })
    },
    login: async (parent, { username, password }) => {
        return new Promise(async (resolve, reject) => {
            // basic checks
            if (username.length < 1) {
                return reject("A Username or Email is required!")
            }
            if (password.length < 1) {
                return reject("A Password is required!")
            }

            //check if user exists or not
            dbPool.query(`SELECT id, username, email FROM users WHERE email = '${username}' OR username = '${username}'`, (error, results) => {
                if (error) {
                    errorHandler(error);
                    return reject("An Internal Server Error Occurred!");
                }
                if (results && results.length > 0) {

                    // making a JWT
                    const auth_token = jwt.sign({ id: results[0].id }, JWT_SECRET)
                    resolve({ ...results[0], auth_token })
                }
            })
        })
    }
};

module.exports = Mutation;
