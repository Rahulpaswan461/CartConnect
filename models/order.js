const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    orderItems:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:'OrderItem',
      required:true,
    }],
    shippingAddress:{
      type:String,
      required:true,
    },
    shippingAddress2:{
      type:String
    },
    city:{
      type:String,
      required:true,
    },
    zip:{
      type:String,
      required:true,
    },
    country:{
      type:String,
      required:true,
    },
    phone:{
      type:String,
      required:true,
    },
    status:{
      type:String,
      required:true,
      default:'Pending',
    },
    totalPrice:{
      type:Number,
    },
    user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'user',
    },
    dateOrdered:{
      type:Date,
      default:Date.now,
    }

},{timestamps:true})

orderSchema.virtual('id').get(function(){
  return this._id.toHexString();
})

orderSchema.set('toJSON',{
  virtuals:true,
})


const Order = mongoose.model("order",orderSchema)

module.exports = Order
