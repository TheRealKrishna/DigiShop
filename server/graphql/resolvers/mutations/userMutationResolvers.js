const dbPool = require("../../../database/dbPool");
const errorHandler = require("../../../handlers/error_handler")
const validator = require("email-validator");
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');
const { GraphQLError } = require('graphql');
const JWT_SECRET = process.env.JWT_SECRET
const resetPasswordMail = require("../middleware/resetPasswordMail")
const randomstring = require("randomstring");
const axios = require("axios")


const userMutation = {
    createAccount: async (parent, { name, email, password }) => {
        return new Promise(async (resolve, reject) => {
            try {
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
                        throw error
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
                                    throw error
                                }

                                // making a JWT
                                const auth_token = jwt.sign({ id: results.insertId }, JWT_SECRET)

                                dbPool.query(
                                    `SELECT id, name, email, profile FROM users WHERE email = '${email}'`, (error, results) => {
                                        if (error) {
                                            throw error
                                        }
                                        resolve({ ...results[0], auth_token })
                                    })
                            })
                    }
                })
            }
            catch (error) {
                errorHandler(error);
                return reject(new GraphQLError("An Internal Server Error Occurred!"));
            }
        })
    },
    login: async (parent, { email, password }) => {
        return new Promise(async (resolve, reject) => {
            try {
                // basic checks
                if (email.length < 1) {
                    return reject(new GraphQLError("An Email is required!"))
                }
                if (password.length < 1) {
                    return reject(new GraphQLError("A Password is required!"))
                }

                //check if user exists or not
                dbPool.query(`SELECT * FROM users WHERE email = '${email}'`, (error, results) => {
                    if (error) {
                        throw error
                    }

                    else if (results && results.length > 0) {
                        if (!results[0].password) {
                            return reject(new GraphQLError("Invalid Credentials!"));
                        }
                        if (!bcrypt.compareSync(password, results[0].password)) {
                            return reject(new GraphQLError("Invalid Credentials!"));
                        }
                        // making a JWT
                        const auth_token = jwt.sign({ id: results[0].id }, JWT_SECRET)
                        delete results[0].password
                        resolve({ ...results[0], auth_token })
                    }
                    else {
                        return reject(new GraphQLError("Invalid Credentials!"));
                    }
                })
            }
            catch (error) {
                errorHandler(error);
                return reject(new GraphQLError("An Internal Server Error Occurred!"));
            }
        })
    },
    loginGoogle: async (parent, args, context) => {
        const accessToken = context.access_token
        return new Promise(async (resolve, reject) => {
            try {
                axios.get("https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses,photos,", {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    }
                }).then(async (response) => {
                    const name = response.data.names[0].displayName
                    const email = response.data.emailAddresses[0].value
                    const profile = response.data.photos[0].url

                    //checking if user exists or not
                    dbPool.query(`SELECT id, name, email, profile FROM users WHERE email = '${email}'`, (error, results) => {
                        if (error) {
                            throw error
                        }
                        else if (results && results.length > 0) {

                            // making a JWT
                            const auth_token = jwt.sign({ id: results[0].id }, JWT_SECRET)

                            resolve({ ...results[0], auth_token })
                        }
                        else {
                            dbPool.query(
                                `INSERT INTO users (name, email, profile) VALUES ('${name}', '${email}', '${profile}')`
                                , (error, results) => {
                                    if (error) {
                                        throw error
                                    }

                                    // making a JWT
                                    const auth_token = jwt.sign({ id: results.insertId }, JWT_SECRET)

                                    dbPool.query(
                                        `SELECT id, name, email, profile FROM users WHERE email = '${email}'`, (error, results) => {
                                            if (error) {
                                                throw error
                                            }
                                            resolve({ ...results[0], auth_token })
                                        })
                                })
                        }
                    })
                })
            }
            catch (error) {
                errorHandler(error);
                return reject(new GraphQLError("An Internal Server Error Occurred!"));
            }
        })
    },
    forgotPassword: async (parent, { email, reCaptchaToken }) => {
        return new Promise(async (resolve, reject) => {
            try {
                const captchaResponse = await axios.get(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${reCaptchaToken}`)
                if (!captchaResponse.data.success) {
                    return reject(new GraphQLError("Invalid Captcha Response!"))
                }


                // basic checks
                if (email.length < 1) {
                    return reject(new GraphQLError("An Email is required!"))
                }

                dbPool.query(`SELECT * FROM users WHERE email = '${email}'`, (error, results) => {
                    if (error) {
                        throw error
                    }
                    else if (results && results.length > 0) {
                        const passwordResetToken = results[0].id + randomstring.generate()
                        dbPool.query(`UPDATE users SET passwordResetToken = '${passwordResetToken}' WHERE email='${email}'`, (error, results) => {
                            if (error) {
                                throw error
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
                    else {
                        return reject(new GraphQLError("We could not find your account!"));
                    }
                })
            }
            catch (error) {
                errorHandler(error);
                return reject(new GraphQLError("An Internal Server Error Occured!"));
            }
        })
    },
    changePassword: async (parent, { password, confirmPassword }, context) => {
        return new Promise(async (resolve, reject) => {
            try {
                const passwordResetToken = context.passwordresettoken

                // basic checks
                if (password.length < 8) {
                    return reject(new GraphQLError("Password must have atleast 8 characters!"))
                }
                if (password !== confirmPassword) {
                    return reject(new GraphQLError("Password and confirm password do not match!"))
                }

                dbPool.query(`SELECT * FROM users WHERE passwordResetToken = '${passwordResetToken}'`, (error, results) => {
                    if (error) {
                        throw error
                    }
                    else if (results && results.length > 0) {
                        // making new password hash
                        const securePassword = bcrypt.hashSync(password, 10);
                        const userEmail = results[0].email
                        dbPool.query(`UPDATE users SET password = '${securePassword}' WHERE passwordResetToken='${passwordResetToken}'`, (error, results) => {
                            if (error) {
                                throw error
                            }
                            if (results) {
                                dbPool.query(`UPDATE users SET passwordResetToken = NULL WHERE email='${userEmail}'`, () => {
                                    return resolve({ message: "Password changed successfully!", success: true })
                                })
                            }
                        })
                    }
                    else {
                        return reject(new GraphQLError("Your password changing request is expired!"));
                    }
                })
            }
            catch(error){
                errorHandler(error);
                return reject(new GraphQLError("An Internal Server Error Occured!"));
            }
            })
    }
};

module.exports = userMutation;
