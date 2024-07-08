const express = require("express")
const product = require("../controllers/product.js")
const multer = require("multer")

const router = express.Router()

const FILE_TYPE_MAP={
    'image/png':'png',
    'image/jpeg':'jepg',
    'image/jpg':'jpg'
}

const storage = multer.diskStorage({
  destination:function(req,file,cb){
      const isValid = FILE_TYPE_MAP[file.mimetype]
      let uploadError = new Error("Invalid image type")
      
      if(isValid){
         uploadError = null
      }
      cb(uploadError,'public/upload')
  },
  filename:function(req,file,cb){
    const fileName = file.originalname.split(' ').join('-')
    const extension = FILE_TYPE_MAP[file.mimetype]
    cb(null,`${fileName}-${Date.now()}.${extension}`)
  }
})

const upload = multer({storage:storage})

router.get("/",product.getAllProducts)
router.get("/",product.getProductByQuery)
router.get("/:productId",product.getSpecificProductById)
router.post("/create/:id",upload.single("image"),product.createProduct) // id is of category not of product
router.patch("/update/:productId",product.updateProductInformation)
router.delete("/delete/:productId",product.deleteProduct)
router.post("/add/:productId/:orderId",product.addProductToOrder)
router.get("/get/count",product.getProductCount)
router.get("/get/featuredProduct/:count",product.getFeaturedProduct)
router.get("/",product.getProductByQueryParams)
router.patch('/gallery-images/:id',upload.array('images',10),product.uploadMultipleImages)



module.exports = router