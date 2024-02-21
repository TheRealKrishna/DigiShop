const { ApolloServer } = require('@apollo/server');
const typeDefs = require("./schema/typeDefs")
const resolvers = require("./resolvers/resolvers")

// const typeDefs = `
// type Query {
//   dummy: String
// }

// type Mutation {
//   getJwt(name: String): Message
// }
// `;

// const resolvers = {
// Query: {
//   dummy: () => "Hello from GraphQL!"
// },
// Mutation: {
//   getJwt: (_, args, context) => {
//     // Access request object directly from the context
//     console.log(context.token);
//     // const { req } = context;
//     // const { headers } = req;
//     // console.log(headers  ); // Log headers
//     return { text: context.token };
//   }
// }
// };

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        console.log("hii i am context");
        console.log(req.headers.token);
        return req.headers;
    },
});


module.exports = server;