const jsonWebToken = require("jsonwebtoken")

function generateJWT(data) {
    let token = jsonWebToken.sign(data, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRY })
    return token
}

module.exports.generateJWT = generateJWT