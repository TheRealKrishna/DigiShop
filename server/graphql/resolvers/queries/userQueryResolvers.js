const dbPool = require("../../../database/dbPool");
const errorHandler = require("../../../handlers/error_handler");
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET

const Query = {
    user: (parent, args, context) => {
        return new Promise((resolve, reject) => {
            jwt.verify(context.auth_token, JWT_SECRET, (error, decoded)=>{
                if(error){
                    errorHandler(error);
                    reject("An Internal Server Error Occurred!");
                }
                dbPool.query(`SELECT * FROM users WHERE id = '${decoded.id}'`, (error, results) => {
                    if (error) {
                        errorHandler(error);
                        reject("An Internal Server Error Occurred!");
                    } else {
                        if (results.length > 0) {
                            resolve(results[0]);
                        } else {
                            resolve(null);
                        }
                    }
                })
            })
        })
    }
}

module.exports = Query;
