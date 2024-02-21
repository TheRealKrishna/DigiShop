const userMutations = `
  type Mutation {
    createAccount(username: String!, email: String!, password: String!): User!
    login(username:String!, password:String!): User!
  }
`;

module.exports = userMutations;