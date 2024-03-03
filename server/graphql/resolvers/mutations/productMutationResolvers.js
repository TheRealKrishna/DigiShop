const dbPool = require("../../../database/dbPool");
const errorHandler = require("../../../handlers/error_handler")
const jwt = require('jsonwebtoken');
const { GraphQLError } = require('graphql');
const JWT_SECRET = process.env.JWT_SECRET

const handleError = (error, reject) => {
    errorHandler(error);
    reject(new GraphQLError("An Internal Server Error Occurred!"));
};

const productMutation = {
    addProduct: async (parent, { title, description, price, discountedPrice, thumbnail }, context) => {
        return new Promise(async (resolve, reject) => {
            try {
                // basic checks
                if (title.length < 5) {  // title minimum length 5
                    return reject(new GraphQLError("Product title must have atleast 5 characters!"))
                }
                if (description.length < 100) {  // description minimum length 100
                    return reject(new GraphQLError("Product description must have atleast 100 characters!"))
                }
                if (price < 2) {  // price minimum 2 ₹
                    return reject(new GraphQLError("The minimum product price should be ₹2!"))
                }
                if (discountedPrice < 1) {  // title minimum length 5
                    return reject(new GraphQLError("The minimum discounted product price should be ₹1!"))
                }
                if (discountedPrice >= price) { // price must be greater
                    return reject(new GraphQLError("Actual product price should be higher than the discounted price!"))
                }
                if (!thumbnail) {  // thumbnail required
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
                    dbPool.query(`SELECT * FROM users WHERE id = '${decoded.id}'`, (error, users) => {
                        if (error) {
                            handleError(error, reject);
                        }
                        else if (users && users.length > 0) {
                            dbPool.query(
                                `INSERT INTO products (title, description, price, discountedPrice, thumbnail, seller_id) VALUES ('${title}', '${description}', '${price}', '${discountedPrice}', '${thumbnail}', '${users[0].id}')`
                                , (error, results) => {
                                    if (error) {
                                        handleError(error, reject);
                                    }
                                    return resolve({ id: results.insertId, title, description, price, discountedPrice, thumbnail, seller_id:users[0].id, rating: null, reviews: [] })
                                })
                        }
                        else {
                            return reject(new GraphQLError("User Does Not Exist!"));
                        }
                    })
                })
            }
            catch (error) {
                handleError(error, reject);
            }
        })
    },
};

module.exports = productMutation;
