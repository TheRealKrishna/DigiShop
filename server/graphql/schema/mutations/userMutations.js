const userMutations = `
  type Mutation {
    createAccount(name: String!, email: String!, password: String!): User
    login(email:String!, password:String!): User
  }
`;

module.exports = userMutations;