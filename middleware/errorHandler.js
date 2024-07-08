function errorHandler(error,req,res,next){

    // Jwt error handler
    if(error.name=="UnauthorizedError"){
         return res.status(401).json({msg:"The user is not authorized "})
    }

    // validation error
    if(error.name=="ValidationError"){
        return res.status(401).json({msg:error})
    }
    // other errors
    return res.status(500).json(error)
}

module.exports = errorHandler