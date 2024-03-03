const productQueries = `
    type Query {
        product(id : ID!): Product
        products: [Product]
    }
    `

module.exports = productQueries;