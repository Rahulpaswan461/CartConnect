const Category = require("../models/category")

async function getAllCategory(req,res){
    try{
       const category = await Category.find({})

       if(!category){
         return res.status(404).json({msg:"NO Information Present !"})

       }

       return res.status(200).json(category)
    }
    catch(error){
        console.log("There is some error",error)
        return res.status(500).json({msg:"Internal Server Error"})
    }
}

async function addNewCategroy(req,res){
    try{
        const categoryData = req.body;
        if(!categoryData){
            return res.status(404).json({msg:"Information Incomplete !!"})
        }

        const category = await Category.create({
            name:categoryData.name,
            color:categoryData.color,
            icon:categoryData.icon
        })

        if(!category){
            return res.status(404).json({msg:"NO Categroy is created !!"})
        }
         await category.save()
        return res.status(200).json(category)
    }
    catch(error){
        console.log("There is some error",error)
        return res.status(500).json({msg:"Internal Server Error "})
    }
}

async function deleteCategory(req,res){
    try{
      const id = req.params.categoryId;
      const category = await Category.findByIdAndDelete(id)
      
       if(!category){
          return res.status(404).json({msg:"No category found withe associate id"})
       }
      return res.status(200).json({msg:"Category is deleted successfully !!!"})
    }
    catch(error){
        console.log("There is some error",error)
        return res.status(500).json({msg:"Internal Server Error"})
    }
}
async function gettCategoryByID(req,res){
    try{
        const id = req.params.id
        const category = await Category.findById(id)

        if(!category){
            return res.status(404).json({msg:"No category found withe associate id"})
        }
        return res.status(200).json(category)
    }
    catch(error){
        console.log("There is some error",error)
        return res.status(500).json({msg:"Internal Server Error",error})
    }
}

async function updateCategory(req,res){
    try{
        const category = await Category.findByIdAndUpdate(req.params.id,{
            name:req.body.name,
            color:req.body.color,
            icon:req.body.icon
        },{new:true})

        if(!category){
            return res.status(404).json({msg:"No category found withe associate id"})
        }
        return res.status(200).json(category)
    }
    catch(error){
        console.log("There is some error",error)
        return res.status(500).json({msg:"Internal Server Error"})
    }
}

module.exports = {
    getAllCategory,
    addNewCategroy,
    deleteCategory,
    gettCategoryByID,
    updateCategory
}