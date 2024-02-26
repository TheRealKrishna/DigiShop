const userQueries = `
    type Query {
        user: User
        resetPasswordTokenVerify: booleanResponse
    }
    `
// users: [User!]!

module.exports = userQueries;