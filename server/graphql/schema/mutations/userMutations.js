const userMutations = `
  type Mutation {
    createAccount(name: String!, email: String!, password: String!): User
    login(email:String!, password:String!): User
    forgotPassword(email:String!, reCaptchaToken:String!): booleanResponse
    changePassword(password: String!, confirmPassword: String!): booleanResponse
  }
`;

module.exports = userMutations;