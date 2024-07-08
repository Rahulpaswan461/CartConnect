const { expressjwt: expressJwt } = require("express-jwt");

function authJwt() {
    const secret = "secret";
    return expressJwt({
        secret,
        algorithms: ['HS256'],
        isRevoked:isRevoked
    }).unless({
        path:[
            {url:/\/public\/upload(.*)/,method: ['GET','OPTIONS']},
            {url:/\/api\/product(.*)/,methods:['GET','OPTIONS']}, //we want that user can see product without the login/signup
            {url:/\/api\/category(.*)/,methods:['GET','OPTIONS']},
            '/api/user/register',
            '/api/user/login'
        ]
    })
}

async function isRevoked(req,jwt){
    const payload = jwt.payload

    if(!payload.isAdmin){
        true;
    }
    return false
}

module.exports = {
    authJwt
};
