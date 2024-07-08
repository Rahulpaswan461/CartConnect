const mongoose = require("mongoose")
const orderItemsSchema = new mongoose.Schema({
    quantity:{
        type:Number,
        required:true,
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'product',
        requird:true
    }
},{timestamps:true})

const OrderItems = mongoose.model("OrderItem",orderItemsSchema)

module.exports = OrderItems