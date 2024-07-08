const JWT = require("jsonwebtoken")
const secret = "rahul@#$12345"

function createTokenForUser(user){
    const payload={
        _id:user._id,
        name:user.name,
        email:user.email,
        role:user.role
    }

    return JWT.sign(payload,secret)
}

function verifyToken(token){
    return JWT.verify(token,secret)
}

module.exports = {
    createTokenForUser,
    verifyToken
}