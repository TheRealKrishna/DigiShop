const userQuery = require("./queries/userQueryResolvers")
const productQuery = require("./queries/productQueryResolvers")
const reviewQuery = require("./queries/reviewQueryResolvers")
const userMutation = require("./mutations/userMutationResolvers")
const productMutation = require("./mutations/productMutationResolvers")
const reviewMutation = require("./mutations/reviewMutationResolvers")

const resolvers = {
    Query:{...userQuery, ...productQuery, ...reviewQuery},
    Mutation:{...userMutation, ...productMutation, ...reviewMutation}
};

module.exports = resolvers