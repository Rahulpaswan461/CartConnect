// const { verifyToken } = require("../services/authentication")

// function checkForAuthenticateUser(cookie){
//     return (req,res,next)=>{
//         if (req.path === '/signup' || req.path === '/signin') {
//             return next(); // Proceed to next middleware/route
//         }

//          const token = req.cookies[cookie]
//          if(!token){
//             return next()
//          }

//          try{

//              const payload = verifyToken(token)
//              req.user = payload
//              console.log("requested user info",req.user)
//          }
//          catch(error){

//          }
//          return next()
//     }
// }

// module.exports = {
//     checkForAuthenticateUser
// }