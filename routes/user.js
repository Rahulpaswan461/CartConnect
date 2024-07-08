const express = require("express")
const {registerUser,loginUser, getSpecificUser,getListOfUser,getUserCount,deleteUser} = require("../controllers/user")

const router = express.Router()

router.post("/register",registerUser)
router.post("/login",loginUser)
router.get("/",getListOfUser)
router.get("/get/count",getUserCount)
router.get("/:userId",getSpecificUser)
router.delete("/:userId",deleteUser)


module.exports = router