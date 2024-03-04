const userMutations = `
  type Mutation {
    createAccount(name: String!, email: String!, password: String!): User
    login(email:String!, password:String!): User
    loginGoogle: User
    forgotPassword(email:String!, reCaptchaToken:String!): booleanResponse
    changePassword(password: String!, confirmPassword: String!): booleanResponse
    updateUserCart(product_id: ID!, quantity: Int!): booleanResponse
  }
`;

module.exports = userMutations;