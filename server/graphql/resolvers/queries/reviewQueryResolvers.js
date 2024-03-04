const { GraphQLError } = require("graphql");
const dbPool = require("../../../database/dbPool");
const errorHandler = require("../../../handlers/error_handler");

const handleError = (error, reject) => {
    errorHandler(error);
    return reject(new GraphQLError("An Internal Server Error Occurred!"));
};

const reviewQuery = {
    review: (parent, { id }) => {
        return new Promise((resolve, reject) => {
            try {
                if (!id) {
                    return reject(new GraphQLError("Invalid Request!"));
                }
                dbPool.query(`
                    SELECT r.*, u.name AS reviewer_name 
                    FROM reviews r 
                    JOIN users u ON r.reviewer_id = u.id 
                    WHERE r.id = '${id}'
                `, (error, review) => {
                    if (error) {
                        return handleError(error, reject);
                    }
                    else if (review && review.length > 0) {
                        resolve(review[0]);
                    }
                    else {
                        return reject(new GraphQLError("Review Does Not Exist!"));
                    }
                });
            }
            catch (error) {
                return handleError(error, reject);
            }
        });
    },
    reviews: (parent, { id }) => {
        return new Promise((resolve, reject) => {
            try {
                if (!id) {
                    return reject(new GraphQLError("Invalid Request!"));
                }
                dbPool.query(`
                    SELECT r.*, u.name as reviewer_name 
                    FROM reviews r 
                    JOIN users u ON r.reviewer_id = u.id 
                    WHERE r.product_id = '${id}'
                `, (error, reviews) => {
                    if (error) {
                        return handleError(error, reject);
                    }
                    resolve(reviews);
                });
            } catch (error) {
                return handleError(error, reject);
            }
        });
    },
}

module.exports = reviewQuery;
