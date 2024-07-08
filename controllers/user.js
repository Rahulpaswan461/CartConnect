const User = require("../models/user")
const bcrypt = require("bcryptjs")
const mongoose = require("mongoose")
const JWT = require("jsonwebtoken")

async function registerUser(req,res){
    try{
      let user = new User({
        name:req.body.name,
        email:req.body.email,
        passwordHash:bcrypt.hashSync(req.body.passwordHash,10),
        phone:req.body.phone,
        isAdmin:req.body.isAdmin,
        street:req.body.street,
        appartment:req.body.appartment,
        zip:req.body.zip,
        city:req.body.city,
        country:req.body.country
      })

      user = await user.save()

      if(!user){
        return res.status(400).json({msg:"No user created "})
      }

      return res.status(200).json(user)
    }
    catch(error){
       console.log("Internal Server Error",error)
       return res.status(500).json({msg:"Inernal Server Error"})
    }
}

async function loginUser(req,res){
    try{
       const user = await User.findOne({email:req.body.email})

       if(!user){
         return res.status(200).json({msg:"User is not found !!"})
       }

       if(user && bcrypt.compareSync(req.body.passwordHash,user.passwordHash)){
         const token = JWT.sign({
              userId:user.id,
              isAdmin:user.isAdmin
         },"secret",{expiresIn:'1d'})

          return res.status(200).json({user:"User Authenticated !!",token:token})
       }else{
         return res.status(404).json({msg:"Password is invalid !!"})
       }
    }
    catch(error){
        console.log("There is some error",error)
        return res.status(500).json({msg:"Internal Server Error !!"})
    }
}

async function getListOfUser(req,res){
   try{
       const user = await User.find({}).select("-passwordHash")

       if(!user){
         return res.status(404).json({msg:"No user found !!"})
       }
       return res.status(200).json(user)
   }
   catch(error){
    console.log("There is some error",error)
     return res.status(500).json({msg:"Internal Server Error"})
   }
}

async function getSpecificUser(req,res){
   try{

      if(!mongoose.isValidObjectId(req.params.userId)){
         return res.status(404).json({msg:"Invalid user id !!"})
      }
      const userId = req.params.userId
      const user = await User.findById(userId).select("-passwordHash")
      if(!user){
        return res.status(404).json({msg:"NO user is found with avaialble id !!"})
      }
      
      return res.status(200).json(user)

   }
   catch(error){
    console.log("There is some error",error)
     return res.status(500).json({msg:"Internal Server Error"})
   }
}

async function getUserCount(req,res){
   try{
      const userCount = await User.countDocuments()

      if(!userCount){
        return res.status(404).json({msg:"No user is present!!!"})
      }

      return res.status(200).json({userCount:userCount})
   }
   catch(error){
     console.log("There is some error",error)
     return res.status(500).json({msg:"Internal Servre Error",error})
   }
}

async function deleteUser(req,res){
   try{
     const user = await User.findByIdAndDelete(req.params.userId)

     return res.status(200).json({msg:"User Deleted successfully !!!"})
   }
   catch(error){
     console.log("There is some error",error)
     return res.status(500).json({msg:"Internal Server Error"})
   }
}

module.exports = {
    registerUser,
    loginUser,
    getListOfUser,
    getSpecificUser,
    getUserCount,
    deleteUser
}