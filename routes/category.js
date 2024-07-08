const express = require("express")
const {getAllCategory,addNewCategroy,deleteCategory, 
    gettCategoryByID,updateCategory} = require("../controllers/category")

const router = express.Router()

router.get("/",getAllCategory)
router.post("/",addNewCategroy)
router.delete("/:categoryId",deleteCategory)
router.get("/list",getAllCategory)
router.get("/:id",gettCategoryByID)
router.patch("/:id",updateCategory)

module.exports = router