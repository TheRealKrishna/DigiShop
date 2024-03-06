const userQueries = require('./queries/userQueries');
const productQueries = require('./queries/productQueries');
const reviewQueries = require('./queries/reviewQueries')
const userMutations = require('./mutations/userMutations');
const productMutations = require('./mutations/productMutations');
const reviewMutations = require('./mutations/reviewMutation');

const typeDefs = `
  type User {
    id: ID
    name: String
    email: String
    auth_token: String
    profile: String
    cart: Cart
  }

  type booleanResponse {
    success: Boolean
    message: String
  }

  type Product {
    id: ID
    title: String
    description: String
    price: Float
    discountedPrice: Float
    thumbnail: String
    seller_id: ID
    rating: Float
    reviews: [Review]
  }
  
  type Review{
    id: ID
    product_id: ID
    reviewer_id: ID
    reviewer_name: String
    rating: Float
    title: String
    description: String  
  }
  
  type Cart{
    cartItems: [CartItem]
    total: Int
  }

  type CartItem{
    product_id: ID
    quantity: Int
  }

  input CartItemInput {
    productId: ID!
    quantity: Int!
  }

  ${userQueries}
  ${productQueries}
  ${reviewQueries}
  
  ${userMutations}
  ${productMutations}
  ${reviewMutations}
`;

module.exports = typeDefs;