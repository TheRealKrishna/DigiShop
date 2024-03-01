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


const productMutation = {
    addProduct: async (parent, { title, description, price, discountedPrice, thumbnail }, context) => {
        return new Promise(async (resolve, reject) => {
            try {
                // basic checks
                if (title.length < 5) {
                    return reject(new GraphQLError("Product title must have atleast 5 characters!"))
                }
                if (description.length < 100) {
                    return reject(new GraphQLError("Product description must have atleast 100 characters!"))
                }
                if (price < 2) {
                    return reject(new GraphQLError("The minimum product price should be ₹2!"))
                }
                if (discountedPrice < 1) {
                    return reject(new GraphQLError("The minimum discounted product price should be ₹1!"))
                }
                if (discountedPrice >= price) {
                    return reject(new GraphQLError("Actual product price should be higher than the discounted price!"))
                }
                if (!thumbnail) {
                    return reject(new GraphQLError("A Product thumbnail is required!"))
                }
                const auth_token = context.auth_token
                if (!auth_token) {
                    return reject(new GraphQLError("Invalid Request!"));
                }
                jwt.verify(auth_token, JWT_SECRET, (error, decoded) => {
                    if (error) {
                        return reject(new GraphQLError("Your session has expired, Please refresh the page!"));
                    }
                    dbPool.query(`SELECT * FROM users WHERE id = '${decoded.id}'`, (error, results) => {
                        if (error) {
                            throw error
                        }
                        else if (results && results.length > 0) {
                            dbPool.query(
                                `INSERT INTO products (title, description, price, discountedPrice, thumbnail, seller_id) VALUES ('${title}', '${description}', '${price}', '${discountedPrice}', '${thumbnail}', '${results[0].id}')`
                                , (error, results) => {
                                    if (error) {
                                        throw error
                                    }
                                    dbPool.query(
                                        `SELECT * FROM products WHERE id = '${results.insertId}'`, (error, results) => {
                                            if (error) {
                                                throw error
                                            }
                                            resolve({ ...results[0] })
                                        })
                                })
                        }
                        else {
                            return reject(new GraphQLError("User Does Not Exist!"));
                        }
                    })
                })
            }
            catch (error) {
                errorHandler(error);
                return reject(new GraphQLError("An Internal Server Error Occured"));
            }
        })
    },
};

module.exports = productMutation;
