const express = require('express')
const app = express()
require("dotenv").config()
const cors = require("cors");
const dbConnect = require("./database/connect")
const server = require("./graphql/connect");
const { expressMiddleware } = require("@apollo/server/express4");

dbConnect();
app.use(cors());
app.use(express.json());

const startGraphql = async () => {
    await server.start();
    app.use(
        "/graphql",
        expressMiddleware(server, {
            context: ({ req }) => {
                return req.headers
            },
        })
    );

}

startGraphql();

app.get('/', (req, res) => {
    res.send('Backend For DigiShop!');
})

app.listen(process.env.PORT, () => {
    console.log(`Server Running On http://localhost:${process.env.PORT}`)
})