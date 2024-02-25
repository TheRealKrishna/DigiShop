const dbPool = require("../../../database/dbPool");
const errorHandler = require("../../../handlers/error_handler")
const validator = require("email-validator");
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');
const { GraphQLError } = require('graphql');
const JWT_SECRET = process.env.JWT_SECRET
const resetPasswordMail = require("../middleware/resetPasswordMail")
const randomstring = require("randomstring");


const Mutation = {
    createAccount: async (parent, { name, email, password }) => {
        return new Promise(async (resolve, reject) => {
            // basic checks
            if (name.length < 3) {
                return reject(new GraphQLError("Name must have atleast 3 characters!"))
            }
            if (password.length < 8) {
                return reject(new GraphQLError("Password must have atleast 8 characters!"))
            }
            if (!validator.validate(email)) {
                return reject(new GraphQLError("Please enter a valid email address!"))
            }

            // checking if user already exist with that email
            dbPool.query(`SELECT * FROM users WHERE email = '${email}'`, async (error, results) => {
                if (error) {
                    errorHandler(error);
                    return reject(new GraphQLError("An Internal Server Error Occurred!"));
                }
                if (results && results.length > 0) {
                    return reject(new GraphQLError("A user already exists with that email!"))
                }
                else {

                    // encrypting password
                    const securePassword = bcrypt.hashSync(password, 10);

                    // creating a user with those credentials                    
                    dbPool.query(
                        `INSERT INTO users (name, email, password) VALUES ('${name}', '${email}', '${securePassword}')`
                        , (error, results) => {
                            if (error) {
                                errorHandler(error);
                                return reject(new GraphQLError("An Internal Server Error Occurred!"));
                            }

                            // making a JWT
                            const auth_token = jwt.sign({ id: results.insertId }, JWT_SECRET)

                            dbPool.query(
                                `SELECT id, name, email FROM users WHERE email = '${email}'`, (error, results) => {
                                    if (error) {
                                        errorHandler(error);
                                        return reject(new GraphQLError("An Internal Server Error Occurred!"));
                                    }
                                    resolve({ ...results[0], auth_token })
                                })
                        })
                }
            })
        })
    },
    login: async (parent, { email, password }) => {
        return new Promise(async (resolve, reject) => {
            // basic checks
            if (email.length < 1) {
                return reject(new GraphQLError("An Email is required!"))
            }
            if (password.length < 1) {
                return reject(new GraphQLError("A Password is required!"))
            }

            //check if user exists or not
            dbPool.query(`SELECT id, name, email FROM users WHERE email = '${email}'`, (error, results) => {
                if (error) {
                    errorHandler(error);
                    return reject(new GraphQLError("An Internal Server Error Occurred!"));
                }
                if (results && results.length > 0) {
                    // making a JWT
                    const auth_token = jwt.sign({ id: results[0].id }, JWT_SECRET)
                    resolve({ ...results[0], auth_token })
                }
            })
        })
    },
    forgotPassword: async (parent, { email }) => {
        return new Promise(async (resolve, reject) => {
            const passwordResetToken = randomstring.generate()

            // basic checks
            if (email.length < 1) {
                return reject(new GraphQLError("An Email is required!"))
            }

            dbPool.query(`SELECT * FROM users WHERE email = '${email}'`, (error, results) => {
                if (error) {
                    errorHandler(error);
                    return reject(new GraphQLError("An Internal Server Error Occured"));
                }
                else if (results && results.length > 0) {
                    dbPool.query(`UPDATE users SET passwordResetToken = '${passwordResetToken}' WHERE email='${email}'`, (error, results) => {
                        if (error) {
                            errorHandler(error);
                            return reject(new GraphQLError("An Internal Server Error Occurred!"));
                        }
                        if (results) {
                            const success = resetPasswordMail(email, passwordResetToken);
                            if (success) {
                                return resolve({ message: "Password reset mail sent!", success: true })
                            }
                            else if (!success) {
                                return reject(new GraphQLError("An Internal Server Error Occured!"))
                            }
                        }
                    })
                }
                else{
                    return reject(new GraphQLError("We could not find your account!"));
                }
            })
        })
    }
};

module.exports = Mutation;
