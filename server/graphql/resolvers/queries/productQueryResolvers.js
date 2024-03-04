const { GraphQLError } = require("graphql");
const dbPool = require("../../../database/dbPool");
const errorHandler = require("../../../handlers/error_handler");

const handleError = (error, reject) => {
    errorHandler(error);
    return reject(new GraphQLError("An Internal Server Error Occurred!"));
};

const productQuery = {
    product: (parent, { id }) => {
        return new Promise((resolve, reject) => {
            try {
                if (!id) {
                    return reject(new GraphQLError("Invalid Request!"));
                }
                // Fetch product details
                dbPool.query(`
                SELECT 
                p.*, 
                AVG(r.rating) AS rating,
                CONCAT(
                    '[',
                    GROUP_CONCAT(
                        JSON_OBJECT(
                            'id', r.id,
                            'reviewer_id', r.reviewer_id,
                            'reviewer_name', u.name,
                            'product_id', r.product_id,
                            'rating', r.rating,
                            'title', r.title,
                            'description', r.description
                        )
                        SEPARATOR ','
                    ),
                    ']'
                ) AS reviews
            FROM 
                products p
            LEFT JOIN 
                reviews r ON p.id = r.product_id  
            LEFT JOIN
                users u ON r.reviewer_id = u.id
            WHERE 
                p.id = '${id}'
            GROUP BY 
                p.id;
                    `, (error, products) => {
                    if (error) {
                        return handleError(error, reject);
                    }
                    else if (products && products.length > 0) {
                        const product = products[0];
                        product.reviews = JSON.parse(product.reviews);
                        product.reviews.forEach((review, i) => {
                            if (!review.id) {
                                product.reviews.splice(i, 1);
                            }
                        })
                        resolve(product);
                    }
                    else {
                        return reject(new GraphQLError("Product Does Not Exist!"));
                    }
                });
            }
            catch (error) {
                return handleError(error, reject);
            }
        });
    },
    products: (parent) => {
        return new Promise((resolve, reject) => {
            try {
                dbPool.query(`
                SELECT 
                p.*,
                    AVG(r.rating) AS rating,
                    CONCAT(
                        '[',
                        GROUP_CONCAT(
                            JSON_OBJECT(
                                'id', r.id,
                                'reviewer_id', r.reviewer_id,
                                'reviewer_name', u.name,
                                'product_id', r.product_id,
                                'rating', r.rating,
                                'title', r.title,
                                'description', r.description
                            )
                        SEPARATOR ','
                        ),
                        ']'
                    ) AS reviews
            FROM 
                products p
            LEFT JOIN 
                reviews r ON p.id = r.product_id  
            LEFT JOIN
                users u ON r.reviewer_id = u.id
            GROUP BY 
                p.id;
                `, (error, products) => {
                    if (error) {
                        return handleError(error, reject);
                    }
                    else if (products) {
                        products.forEach((product, i) => {
                            products[i].reviews = JSON.parse(product.reviews);
                            products[i].reviews.forEach((review, j) => {
                                if (!review.id) {
                                    products[i].reviews.splice(j, 1);
                                }
                            })
                        })
                        return resolve(products);
                    }
                    else {
                        return reject(new GraphQLError("Products Does Not Exist!"));
                    }
                })
            }
            catch (error) {
                return handleError(error, reject);
            }
        })
    },
}

module.exports = productQuery;
