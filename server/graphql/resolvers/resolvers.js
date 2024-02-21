const Mutation = require("./mutations/userMutationResolvers")
const Query = require("./queries/userQueryResolvers")

const resolvers = {
    Query,
    Mutation
};

module.exports = resolvers