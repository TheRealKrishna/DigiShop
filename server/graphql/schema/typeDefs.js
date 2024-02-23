const userQueries = require('./queries/userQueries');
const userMutations = require('./mutations/userMutations');

const typeDefs = `
  type User {
    id: ID!
    name: String!
    email: String!
    auth_token: String!
  }

  ${userQueries}
  ${userMutations}
`;

module.exports = typeDefs;