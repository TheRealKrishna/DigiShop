const productQueries = `
    type Query {
        product(id : ID!): Product
        products: [Product]
    }
    `
// users: [User!]!

module.exports = productQueries;