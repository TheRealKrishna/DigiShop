const userMutation = require("./mutations/userMutationResolvers")
const productMutation = require("./mutations/productMutationResolvers")
const userQuery = require("./queries/userQueryResolvers")
const productQuery = require("./queries/productQueryResolvers")

const resolvers = {
    Query:{...userQuery, ...productQuery},
    Mutation:{...userMutation, ...productMutation}
};

module.exports = resolvers