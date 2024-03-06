const userMutations = `
  type Mutation {
    createAccount(name: String!, email: String!, password: String!, cart:String): User
    login(email:String!, password:String!, cart:String): User
    loginGoogle(cart:String): User
    forgotPassword(email:String!, reCaptchaToken:String!): booleanResponse
    changePassword(password: String!, confirmPassword: String!): booleanResponse
    updateCart(product_id: ID!, quantity: Int!): booleanResponse
  }
`;

module.exports = userMutations;