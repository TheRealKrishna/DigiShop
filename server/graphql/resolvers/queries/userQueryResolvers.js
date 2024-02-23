const { GraphQLError } = require("graphql");
const dbPool = require("../../../database/dbPool");
const errorHandler = require("../../../handlers/error_handler");
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET

const Query = {
    user: (parent, args, context) => {
        return new Promise((resolve, reject) => {
            const auth_token = context.auth_token
            jwt.verify(auth_token, JWT_SECRET, (error, decoded) => {
                if (error) {
                    return reject(new GraphQLError("Your session has expired, Please refresh the page!"));
                }
                dbPool.query(`SELECT * FROM users WHERE id = '${decoded.id}'`, (error, results) => {
                    if (error) {
                        errorHandler(error);
                        return reject(new GraphQLError("An Internal Server Error Occurred!"));
                    } else {
                        if (results.length > 0) {
                            resolve({ ...results[0], auth_token });
                        } else {
                            resolve(null);
                        }
                    }
                })
            })
        })
    }
}

module.exports = Query;
