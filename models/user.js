const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    passwordHash:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },
    isAdmin:{
        type:Boolean,
        default:false,
    },
    street:{
        type:String,
        default:'',
    },
    appartment:{
        type:String,
        default:'',
    },
    city:{
        type:String,
        default:'',
    },
    country:{
        type:String,
        default:''
    }
},{timestamps:true})

userSchema.virtual('id').get(function(){
    return this._id.toHexString();
})

userSchema.set('toJSON',{
    virtuals:true,
})

const User = mongoose.model("user",userSchema)

module.exports = User