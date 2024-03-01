const userQueries = require('./queries/userQueries');
const userMutations = require('./mutations/userMutations');
const productQueries = require('./queries/productQueries');
const productMutations = require('./mutations/productMutations');

const typeDefs = `
  type User {
    id: ID!
    name: String!
    email: String!
    auth_token: String!
    profile: String!
  }

  type booleanResponse {
    success: Boolean!
    message: String!
  }

  type Product {
    id: ID!
    title: String!
    description: String!
    price: Float!
    discountedPrice: Float!,
    thumbnail: String!,
    seller_id: ID!,
  }
  
  ${userQueries}
  ${userMutations}

  ${productQueries}
  ${productMutations}
`;

module.exports = typeDefs;