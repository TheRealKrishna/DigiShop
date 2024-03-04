const dbPool = require("../../../database/dbPool");
const errorHandler = require("../../../handlers/error_handler")
const jwt = require('jsonwebtoken');
const { GraphQLError } = require('graphql');
const JWT_SECRET = process.env.JWT_SECRET

const handleError = (error, reject) => {
    errorHandler(error);
    return reject(new GraphQLError("An Internal Server Error Occurred!"));
};

const reviewMutation = {
    addReview: async (parent, { product_id, title, description, rating }, context) => {
        return new Promise(async (resolve, reject) => {
            try {
                // basic checks
                if (title.length < 5) { // title minimum length 5
                    return reject(new GraphQLError("Review title must have atleast 5 characters!"))
                }
                if (description.length < 20) { // description minimum length 20
                    return reject(new GraphQLError("Review description must have atleast 20 characters!"))
                }
                if (rating < 1 || rating > 5) { // ranting can only be between 1-5
                    return reject(new GraphQLError("Rating should be between 1 to 5!"))
                }
                if (!product_id) {  // a product id is necessary
                    return reject(new GraphQLError("Invalid Product Id!"))
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
                                    dbPool.query(`INSERT INTO reviews (product_id, reviewer_id, title, description, rating) VALUES ('${product_id}', '${user.id}', '${title}', '${description}', '${rating}')`, (error, results) => {
                                        if (error) {
                                            return handleError(error, reject);
                                        }
                                        resolve({ id: results.insertId, product_id, reviewer_id: user.id, title, description, rating, reviewer_name: user.name });
                                    });
                                }
                                else{
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

module.exports = reviewMutation;
