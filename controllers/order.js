const Order = require("../models/order")
const OrderItems = require("../models/order-item")
const Product = require("../models/product")
async function getAllOrderDetails(req,res){
     try{
      const orders = await Order.find({}).populate("user","name").populate({path:'orderItems',populate:{path:'product',populate:'category'}})

      if(!orders){
         return res.status(404).json({msg:"No order present !!"})
      }
      return res.status(200).json(orders)
     }
     catch(error){
        console.log("There is some error",error)
        return res.status(500).json({msg:"Internal Server Error"})
     }
}

async function addProductsToOrderList(req,res){
     try{
        const orderItemsIds = Promise.all(req.body.orderItems.map(async orderItem=>{
            let newOrderItem = new OrderItems({
                quantity:orderItem.quantity,
                product:orderItem.product
            })
            
          //instead of creating the new id of the product we are assigning the send id from the frontend

            newOrderItem = await newOrderItem.save()
            console.log("New Order contains",newOrderItem)
            return newOrderItem._id //so that i can use this id to search in the orderItem table because it is referring
        }))
        const orderItemIdsResolved = await orderItemsIds
        // We are resolving the promises
        console.log("The data from the frontend",orderItemIdsResolved)

        const totalPrices = await Promise.all(orderItemIdsResolved.map(async orderItemId => {
         const orderItem = await OrderItems.findById(orderItemId).populate('product', 'price');
         
         if (!orderItem || !orderItem.product) {
             console.log(`Product not found or product is null for order item ${orderItemId}`);
             return 0; // or handle the error or default case appropriately
         }
         
         const totalPrice = orderItem.product.price * orderItem.quantity;
         return totalPrice;
     }));
         console.log("Price",totalPrices)
         const totalPrice = totalPrices.reduce((a,b)=>a+b,0)

         let order = new Order({
            orderItems:orderItemIdsResolved,
            shippingAddress:req.body.shippingAddress,
            shippingAddress2:req.body.shippingAddress2,
            city:req.body.city,
            zip:req.body.zip,
            country:req.body.country,
            phone:req.body.phone,
            status:req.body.status,
            totalPrice:totalPrice,
            user:req.body.user
         })
         order = await order.save()
         if(!order){
            return res.status(404).json({msg:"Order not placed !!"})
         }

         return res.status(200).json(order)
     }
     catch(error){
        console.log("There is some error",error)
        return res.status(500).json({msg:"Internal Sever Error",error})
     }
}


async function getOrderDetails(req,res){
     try{
        const orderId = req.params.orderId
        const order = await Order.findById(orderId)
        .populate("user", "name")
        .populate({
            path:'orderItems',populate:{
            path:'product',populate:'category'}
        })

        if(!order){
             return res.status(404).json({msg:"No order present with the provided id !!"})
        }

        return res.status(200).json(order)
     }
     catch(error){
         console.log("There is some error",error)
         return res.status(500).json({msg:"Internal Server Error",error})
     }
}

async function updateOrderStatus(req,res){
     try{
       const order = await Order.findByIdAndUpdate(req.params.orderId,
        {
            status:req.body.status
        },{new:true})
    
       if(!order){
          return res.status(404).json({msg:"No order is present !!"})
       }
       return res.status(200).json(order)
     }
     catch(error){
        console.log("There is some error",error)
        return res.status(500).json({msg:"Internal Server Error"})
     }
}

const deleteOrder = async (req, res) => {
   try {
     const order = await Order.findByIdAndDelete(req.params.orderId);
 
     if (order) {
       // Use Promise.all to wait for all deletions in orderItems array
       await Promise.all(order.orderItems.map(async (orderItemId) => {
         await OrderItems.findByIdAndDelete(orderItemId);
       }));
 
       return res.status(200).json({ success: true, message: "Order deleted successfully !!" });
     } else {
       return res.status(404).json({ success: false, message: "Order not deleted" });
     }
   } catch (error) {
     return res.status(500).json({ success: false, error: error.message });
   }
 };


async function totalSales(req,res){
     try{
         const totalSales = await Order.aggregate([
            { $group: {_id:null, totalSales : {$sum : '$totalPrice'}}}
         ])

         if(!totalSales){
             return res.status(400).json({msg:"No sales are present !!"})
         }

         return res.status(200).json({totalSales:totalSales})
     }
     catch(error){
       console.log("There is some error",error)
       return res.status(500).json({msg:"Internal Server Error"})
     }
}

async function orderPlacedCount(req,res){
     try{
        const orderCount = await Order.countDocuments()

        if(!orderCount){
          return res.status(400).json({msg:"No order placed !!"})
        }

        return res.status(200).json({orderPlacedCountVal:orderCount})
     }
     catch(error){
       console.log("There is some error",error)
       return res.status(500).json({msg:"Internal Server Error",error})
     }
}

async function getOrderHistoryForSpecificUser(req,res){
     try{
         const userOrderList = await Order.find({user:req.params.userId})
         .populate({path:'orderItems',
         populat:{path:'product',populate:'category'}})

         return res.status(200).json(userOrderList)
     }
     catch(error){8
        console.log("There is some error",error)
        return res.status(500).json({msg:"Internal Server Error"})
     }
}
 
module.exports = {
    getAllOrderDetails,
    addProductsToOrderList,
    getOrderDetails,
    updateOrderStatus,
    deleteOrder,
    totalSales,
    orderPlacedCount,
    getOrderHistoryForSpecificUser
}