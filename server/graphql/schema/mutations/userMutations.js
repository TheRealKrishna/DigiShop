const userMutations = `
  type Mutation {
    createAccount(name: String!, email: String!, password: String!): User
    login(email:String!, password:String!): User
    forgotPassword(email:String!): ForgotPasswordResponse
  }
`;

module.exports = userMutations;