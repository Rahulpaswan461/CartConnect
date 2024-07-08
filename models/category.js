const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    color:{
        type:String,
    },
    icon:{
        type:String,
    },
    image:{
        type:String,
        default:''
    }
},{timestamps:true})

const Category = mongoose.model("category",categorySchema)

module.exports = Category