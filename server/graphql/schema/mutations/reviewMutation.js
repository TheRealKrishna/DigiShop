const reviewMutations = `
  type Mutation {
    addReview(product_id: ID!, title: String!, description: String!, rating: Float!): Review
  }
`;



/*
title VARCHAR(255) NOT NULL,
description TEXT,
price DECIMAL(10, 2) NOT NULL,
discountedPrice DECIMAL(10, 2) NOT NULL,
thumbnail VARCHAR(255),
seller_id INT,
rating_id INT,
FOREIGN KEY (seller_id) REFERENCES users(id),
FOREIGN KEY (rating_id) REFERENCES ratings(id)
*/

module.exports = reviewMutations;