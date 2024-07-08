const express = require("express")
const {getAllOrderDetails,addProductsToOrderList,
    getOrderDetails,updateOrderStatus,deleteOrder,
    totalSales,orderPlacedCount,getOrderHistoryForSpecificUser} = require("../controllers/order") 

const router = express.Router()

router.get("/",getAllOrderDetails)
router.post("/",addProductsToOrderList)
router.get("/get/:orderId",getOrderDetails)
router.patch("/:orderId",updateOrderStatus)
router.delete("/:orderId",deleteOrder)
router.get("/totalSales",totalSales)
router.get("/get/count",orderPlacedCount)
router.get("/get/history/:userId",getOrderHistoryForSpecificUser)
module.exports = router