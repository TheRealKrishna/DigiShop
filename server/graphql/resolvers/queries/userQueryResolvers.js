const { GraphQLError } = require("graphql");
const dbPool = require("../../../database/dbPool");
const errorHandler = require("../../../handlers/error_handler");
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET

const handleError = (error, reject) => {
    errorHandler(error);
    return reject(new GraphQLError("An Internal Server Error Occurred!"));
};

const userQuery = {
    user: (parent, args, context) => {
        return new Promise((resolve, reject) => {
            try {
                const auth_token = context.auth_token
                if (!auth_token) {
                    return reject(new GraphQLError("Invalid Request!"));
                }
                jwt.verify(auth_token, JWT_SECRET, (error, decoded) => {
                    if (error) {
                        return reject(new GraphQLError("Your session has expired, Please refresh the page!"));
                    }
                    dbPool.query(`
                    SELECT
                    u.*,
                    CONCAT(
                        '{ "cartItems": ',
                        CASE
                            WHEN COUNT(c.id) > 0 THEN
                                CONCAT(
                                    '[',
                                    GROUP_CONCAT(
                                        DISTINCT JSON_OBJECT(
                                            'product_id', p.id,
                                            'quantity', c.quantity
                                        )
                                        SEPARATOR ','
                                    ),
                                    ']'
                                )
                            ELSE
                                '[]'
                        END,
                        ', "total": ',
                        COALESCE(
                            (
                                SELECT SUM(p.discountedPrice * c.quantity)
                                FROM products p
                                JOIN cart c ON p.id = c.product_id
                                WHERE c.user_id = u.id
                            ),
                            0
                        ),
                        '}'
                    ) AS cart
                FROM
                    users u
                LEFT JOIN cart c ON u.id = c.user_id
                LEFT JOIN products p ON p.id = c.product_id
                WHERE
                    u.id = '${decoded.id}'
                GROUP BY
                    u.id;
                        `, (error, results) => {
                        if (error) {
                            return handleError(error, reject);
                        }
                        else if (results && results.length > 0) {
                            const user = results[0];
                            user.cart = JSON.parse(user.cart)
                            delete user.password
                            delete user.passwordResetToken
                            resolve({ ...user, auth_token });

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
    resetPasswordTokenVerify: async (parent, args, context) => {
        return new Promise(async (resolve, reject) => {
            try {
                const passwordResetToken = context.passwordresettoken
                if (!passwordResetToken) {
                    return reject(new GraphQLError("Invalid Request!"));
                }
                dbPool.query(`SELECT * FROM users WHERE passwordResetToken = '${passwordResetToken}'`, (error, results) => {
                    if (error) {
                        return handleError(error, reject);
                    }
                    else if (results && results.length > 0) {
                        return resolve({ message: "Token Verified!", success: true })
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
}

module.exports = userQuery;
