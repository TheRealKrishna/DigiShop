const { GraphQLError } = require("graphql");
const dbPool = require("../../../database/dbPool");
const errorHandler = require("../../../handlers/error_handler");
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET

const productQuery = {
    product: (parent, { id }) => {
        return new Promise((resolve, reject) => {
            if (!id) {
                return reject(new GraphQLError("Invalid Request!"));
            }
            dbPool.query(`SELECT * FROM products WHERE id = '${id}'`, (error, results) => {
                if (error) {
                    errorHandler(error);
                    return reject(new GraphQLError("An Internal Server Error Occurred!"));
                }
                else if (results && results.length > 0) {
                    if (results.length > 0) {
                        resolve({ ...results[0] });
                    } else {
                        resolve(null);
                    }
                }
                else {
                    return reject(new GraphQLError("Product Does Not Exist!"));
                }
            })
        })
    },
    products: (parent) => {
        return new Promise((resolve, reject) => {
            dbPool.query(`SELECT * FROM products`, (error, results) => {
                if (error) {
                    errorHandler(error);
                    return reject(new GraphQLError("An Internal Server Error Occurred!"));
                }
                else if (results) {
                    resolve(results);
                }
                else {
                    return reject(new GraphQLError("Products Does Not Exist!"));
                }
            })
        })
    },
}

module.exports = productQuery;
