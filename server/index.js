const express = require('express')
const app = express()
require("dotenv").config()


app.get('/', (req, res) => {
    res.send('Backend For DigiShop!');
})

app.listen(80, () => {
    console.log(process.env.FRONTEND_URL)
    console.log(`Server Running On http://localhost:${80}`)
})