const reviewQueries = `
    type Query {
        review(id : ID!): Review
        reviews(id : ID!): [Review]
    }
    `

module.exports = reviewQueries;