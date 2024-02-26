const { GraphQLError } = require("graphql");
const dbPool = require("../../../database/dbPool");
const errorHandler = require("../../../handlers/error_handler");
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET

const Query = {
    user: (parent, args, context) => {
        return new Promise((resolve, reject) => {
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
                        errorHandler(error);
                        return reject(new GraphQLError("An Internal Server Error Occurred!"));
                    }
                    else if (results && results.length > 0) {
                        if (results.length > 0) {
                            delete results[0].password
                            resolve({ ...results[0], auth_token });
                        } else {
                            resolve(null);
                        }
                    }
                    else {
                        return reject(new GraphQLError("User Does Not Exist!"));
                    }
                })
            })
        })
    },
    resetPasswordTokenVerify: async (parent, args, context) => {
        return new Promise(async (resolve, reject) => {
            const passwordResetToken = context.passwordresettoken
            if (!passwordResetToken) {
                return reject(new GraphQLError("Invalid Request!"));
            }
            dbPool.query(`SELECT * FROM users WHERE passwordResetToken = '${passwordResetToken}'`, (error, results) => {
                if (error) {
                    errorHandler(error);
                    return reject(new GraphQLError("An Internal Server Error Occured"));
                }
                else if (results && results.length > 0) {
                    return resolve({ message: "Token Verified!", success: true })
                }
                else {
                    return reject(new GraphQLError("Your password changing request is expired!"));
                }
            })
        })
    },
}

module.exports = Query;
