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


const handleError = (error, reject) => {
    errorHandler(error);
    return reject(new GraphQLError("An Internal Server Error Occurred!"));
};

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
                        return handleError(error, reject);
                    }
                    if (results && results.length > 0) {
                        return reject(new GraphQLError("A user already exists with that email!"))
                    }
                    else {
                        // encrypting password
                        const securePassword = bcrypt.hashSync(password, 10);

                        // creating a user with those credentials                    
                        dbPool.query(
                            `INSERT INTO users (name, email, password, profile) VALUES ('${name}', '${email}', '${securePassword}', '${process.env.DEFAULT_PROFILE_FOR_USERS}')`
                            , (error, results) => {
                                if (error) {
                                    return handleError(error, reject);
                                }
                                const auth_token = jwt.sign({ id: results.insertId }, JWT_SECRET)
                                return resolve({ id: results.insertId, name, email, profile: process.env.DEFAULT_PROFILE_FOR_USERS, auth_token })
                            })
                    }
                })
            }
            catch (error) {
                return handleError(error, reject);
            }
        })
    },

    login: async (parent, { email, password }) => {
        return new Promise(async (resolve, reject) => {
            try {
                // basic checks
                if (!email) {
                    return reject(new GraphQLError("An Email is required!"))
                }
                if (!password) {
                    return reject(new GraphQLError("A Password is required!"))
                }
                //check if user exists or not
                dbPool.query(`SELECT * FROM users WHERE email = '${email}'`, (error, results) => {
                    if (error) {
                        return handleError(error, reject);
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
                        return resolve({ ...results[0], auth_token })
                    }
                    else {
                        return reject(new GraphQLError("Invalid Credentials!"));
                    }
                })
            }
            catch (error) {
                return handleError(error, reject);
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
                            return handleError(error, reject);
                        }
                        else if (results && results.length > 0) {
                            // making a JWT
                            const auth_token = jwt.sign({ id: results[0].id }, JWT_SECRET)
                            return resolve({ ...results[0], auth_token })
                        }
                        else {
                            dbPool.query(
                                `INSERT INTO users (name, email, profile) VALUES ('${name}', '${email}', '${profile}')`
                                , (error, results) => {
                                    if (error) {
                                        return handleError(error, reject);
                                    }
                                    // making a JWT
                                    const auth_token = jwt.sign({ id: results.insertId }, JWT_SECRET)
                                    return resolve({ id: results.insertId, name, email, profile, auth_token })
                                })
                        }
                    })
                })
            }
            catch (error) {
                return handleError(error, reject);
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
                        return handleError(error, reject);
                    }
                    else if (results && results.length > 0) {
                        const passwordResetToken = results[0].id + randomstring.generate()
                        dbPool.query(`UPDATE users SET passwordResetToken = '${passwordResetToken}' WHERE email='${email}'`, (error, results) => {
                            if (error) {
                                return handleError(error, reject);
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
                return handleError(error, reject);
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
                        return handleError(error, reject);
                    }
                    else if (results && results.length > 0) {
                        // making new password hash
                        const securePassword = bcrypt.hashSync(password, 10);
                        dbPool.query(`UPDATE users SET password = '${securePassword}', passwordResetToken = NULL WHERE passwordResetToken='${passwordResetToken}'`, (error) => {
                            if (error) {
                                return handleError(error, reject);
                            }
                            return resolve({ message: "Password changed successfully!", success: true })
                        })
                    }
                    else {
                        return reject(new GraphQLError("Your password changing request is expired!"));
                    }
                })
            }
            catch (error) {
                return handleError(error, reject);
            }
        })
    },
    updateUserCart: async (parent, { product_id, quantity }, context) => {
        return new Promise(async (resolve, reject) => {
            try {
                // basic checks
                if (!product_id) {  // a product id is necessary
                    return reject(new GraphQLError("Invalid Product Id!"))
                }
                if (typeof (quantity) !== 'number') {
                    return reject(new GraphQLError("Invalid Quantity!"))
                }
                const auth_token = context.auth_token
                if (!auth_token) {
                    return reject(new GraphQLError("Invalid Request!"));
                }
                jwt.verify(auth_token, JWT_SECRET, (error, decoded) => {
                    if (error) {
                        return reject(new GraphQLError("Your session has expired, Please refresh the page!"));
                    }
                    dbPool.query(`SELECT * FROM users WHERE id = '${decoded.id}'`, (error, users) => {
                        if (error) {
                            return handleError(error, reject);
                        }
                        else if (users && users.length > 0) {
                            const user = users[0];
                            dbPool.query(`SELECT * FROM products WHERE id = '${product_id}'`, (error, products) => {
                                if (error) {
                                    return handleError(error, reject);
                                }
                                else if (products && products.length > 0) {
                                    const product = products[0]
                                    //check if product already exist in cart!
                                    dbPool.query(`SELECT * FROM cart WHERE product_id = '${product.id}' AND user_id = '${user.id}'`, (error, results) => {
                                        if (error) {
                                            return handleError(error, reject);
                                        }
                                        else if (results && results.length > 0) {
                                            if (quantity < 1) {
                                                dbPool.query(`DELETE FROM cart WHERE product_id = '${product.id}' AND user_id = '${user.id}'`, (error) => {
                                                    if (error) {
                                                        return handleError(error, reject);
                                                    }
                                                    return resolve({ success: true, message: "Cart Successfully Updated!" });
                                                })
                                            }
                                            else {
                                                dbPool.query(`UPDATE cart SET quantity = ${quantity} WHERE product_id = '${product.id}' AND user_id = '${user.id}'`, (error) => {
                                                    if (error) {
                                                        return handleError(error, reject);
                                                    }
                                                    return resolve({ success: true, message: "Cart Successfully Updated!" });
                                                })
                                            }
                                        }
                                        else {
                                            dbPool.query(`INSERT INTO cart (product_id, user_id, quantity) VALUES ('${product.id}', '${user.id}', ${quantity})`, (error) => {
                                                if (error) {
                                                    return handleError(error, reject);
                                                }
                                                return resolve({ success: true, message: "Cart Successfully Updated!" });
                                            })
                                        }
                                    })
                                }
                                else {
                                    return reject(new GraphQLError("Product Does Not Exist!"));
                                }
                            })
                        }
                        else {
                            return reject(new GraphQLError("User Does Not Exist!"));
                        }
                    })
                })
            }
            catch (error) {
                return handleError(error, reject);
            }
        })
    },
};

module.exports = userMutation;
