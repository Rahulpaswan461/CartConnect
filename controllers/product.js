const Category = require("../models/category");
const Order = require("../models/order");
const Product = require("../models/product")
const mongoose = require("mongoose")


// get the list of products
async function getAllProducts(req,res){
    try{
      const products = await Product.find({}).populate("category")

       if(!products){
        return res.status(404).json({msg:"NO information is present"})
       }

       return res.status(200).json(products)
    }
    catch(error){
        console.log("There is some error",error)
        return res.status(500).json({msg:"Internal Server Error"})
    }
}

// get the product by query

async function getProductByQuery(req,res){
    try{
       const query = req.params.q;
       const product =  await Product.find({
        $or:[
            {name:{$regex:query,option:'i'}},
            {description:{$regex:query,option:'i'}}
        ],
       })

       if(!product){
         return res.status(400).json({msg:"No product found with the above detail !!"})
       }


       return res.status(500).json(product)
    }
    catch(error){
        console.log("There is some error",error)
        return res.status(500).json({msg:"Internal Server Error"})
    }
}

// get the product by id 
async function getSpecificProductById(req,res){
    try{
      const id = req.params.productId;
      const product = await Product.findById(id).populate("category")

      if(!product){
        return res.status(400).json({msg:"No product present with the mention detail : "})
      }

      return res.status(200).json(product)
    }
    catch(error){
      console.log("There is some error",error)
      return res.status(500).json({msg:"Internal Server Error"})
    }
}
// create a new product
async function createProduct(req,res){
    try{

      const category = await Category.findById(req.params.id)
      if(!category){
        return res.status(404).json({msg:"No product present with the associated categroy"})
      }
      const file  = req.file;
      if(!file){
         return res.status(404).json({msg:"There is no file !!"})
      }
      const fileName = req.file.filename;
      console.log("The file name is ",fileName)
      
      const basePath = `${req.protocol}://${req.get('host')}/public/upload/`;
      let product = new Product({
         name:req.body.name,
         description: req.body.description,
         richDescription: req.body.richDescription,
         image: `${basePath}${fileName}`,
         brand: req.body.brand,
         price: req.body.price,
         category: req.body.category,
         countInStocks: req.body.countInStocks,
         rating: req.body.rating,
         numReviews: req.body.numReviews,
         isFeatured: req.body.isFeatured
      })
      
      product = await product.save()
      if(!product){
        return res.status(400).json({msg:"Product can't be created "})
      }
      return res.status(200).json(product)
     
    }
    catch(error){
      console.log("There is some error",error)
      return res.status(500).json({msg:"Internal Server Errorrr",error})
    }
}

// update the product information

async function updateProductInformation(req,res){
    try{
       if(!mongoose.isValidObjectId(req.params.productId)){
        return res.status(404).json({msg:"Invalid product id "})
       }
       const category = await Category.findById(req.body.category)
       if(!category){
         return res.status(404).json({msg:"No categroy is there with the id !!"})
       }
       const product = await Product.findByIdAndUpdate(req.params.productId,
        {
          name:req.body.name,
          description:req.body.description,
          richDescription:req.body.richDescription,
          image: req.body.image,
          brand: req.body.brand,
          price: req.body.price,
          category: req.body.category,
          countInStocks: req.body.countInStocks,
          rating: req.body.rating,
          numReviews: req.body.numReviews,
          isFeatured: req.body.isFeatured
        },
        {new:true}
       )
       if(!product){
        return res.status(404).json({msg:"No product is present with associated id !!"})
       }
       return res.status(200).json(product)
    }
    catch(error){
        console.log("There is some error",error)
        return res.status(500).json({msg:"Internal Sever Error"})
    }
}

// delete the product
async function deleteProduct(req,res){
    try{
       const productId = req.params.productId

       const deleteProduct = await Product.findByIdAndDelete(productId)

       return res.status(200).json({msg:"Product Remove successfully !!!"})
    }
    catch(error){
        console.log("There is some error",error)
        return res.status(500).json({msg:"Internal Server Error"})
    }
}
// add product to the order
async function addProductToOrder(req,res){
   try{
      const productId = req.params.productId
      const orderId = req.params.orderId
       
       
      const product = await Product.findById(productId)
      if(!product){
        return res.status(400).json({msg:"No product is available !!!"})
      }

      const order = await Order.findById(orderId)
      if(!order){
         return res.status(400).json({msg:"No order is found !!"})
      }
      order.orderItems.push(product)
      await product.save()
      await order.save()

      return res.status(200).json(order)
   }
   catch(error){
     console.log("There is some error",error)
     return res.status(500).json({msg:"Internal Server Error"})
   }
}

// get the product count 
async function getProductCount(req,res){
   try{
       const productCount = await Product.countDocuments()

       if(!productCount){
        return res.status(404).json({msg:"No product are available !!"})
       }
       return res.status(200).json({productCount:productCount})
   }
   catch(error){
    console.log("There is some error",error)
     return res.status(500).json({msg:"Internal Server Error",error})
   }
}

// get the featured product
async function getFeaturedProduct(req,res){
   try{
    const count = req.params.count ? req.params.count :0;
     const product = await Product.find({isFeatured:true}).limit(count)

     if(!product){
      return res.status(404).json({msg:"No featured product is present !!"})
     }
     return res.status(200).json({product})
   }
   catch(error){
    console.log("There is some error",error)
    return res.status(500).json({msg:"Internal Server Error"})
   }
}

// get the product by query parameter
async function getProductByQueryParams(req,res){
   try{
       let filter = {}
       if(req.query.categories){
        filter = {category:req.query.category.split(",")}
       }
       const productList = await Product.find(filter).populate("category")

       if(!productList){
         return res.status(500).json({Error:"No product is there"})
       }
       return res.status(200).json(productList)
   }
   catch(error){
    console.log("There is some error",error)
    return res.status(500).json({msg:"Internal Server Error"})
   }
}

async function uploadMultipleImages(req,res){
   try{
      if(!mongoose.isValidObjectId(req.params.id)){
         return res.status(404).json({msg:"Invalid product id !!"})
      }
      const files = req.files
      const basePath = `${req.protocol}://${req.get('host')}/public/upload/`;

      let imagePaths=[]
      if(files){
        files.map( file=>{
          imagePaths.push(`${basePath}${file.filename}`);
        })
      }

      const product = await Product.findByIdAndUpdate(req.params.id,{
        images:imagePaths
      },{new:true})

      if(!product){
         return res.status(404).json({msg:"Product is not updated ",product})
      }

      return res.status(200).json(product)
   }
   catch(error){
     console.log("There is some error",error)
     return res.status(500).json({msg:"Internal Server Error"})
   }
}

module.exports = {
    getAllProducts,
    getProductByQuery,
    getSpecificProductById,
    createProduct,
    updateProductInformation,
    deleteProduct,
    addProductToOrder,
    getProductCount,
    getFeaturedProduct,
    getProductByQueryParams,
    uploadMultipleImages
}