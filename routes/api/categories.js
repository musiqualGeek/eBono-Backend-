const express = require('express')
const router  = express.Router();
const Category = require('../../models/Category')
const { ObjectId } = require('mongodb');
const { baseUrl } = require('../../utils/url');



//Insert Category
router.post("/create", async(req,res) => { 
    const {name,image,searchName} = req.body
    try{
        let category = null;
        category = new Category({
            name:name,
            image:image,
            searchName:searchName
        })
        await category.save();   
        return res.json({msg:'Category Added', category})
    }catch(err){
        console.log(err.message)
        res.status(500).send("Server error")
    }
})


//Get All Categories
router.get("/", async(req,res) => { 
    try{
        const url = baseUrl(req)
        const categories = await Category.find().sort({"name":1})
        if(categories.length > 0){
            categories.map(val => {
            val.image = `${url}${val.image}`
        })
        return res.json({categories}) 
        } else {
            return res.json({msg:'No categories Found'})
        }
    }catch(err){
        console.log(err.message)
        res.status(500).send("Server error")
    }
})



//Delete Category
router.post('/delete', async(req,res) => {
    try{
        const {id} = req.body
        const cat = await Category.findById(ObjectId(id))
            if(cat){
                const category = await Category.findByIdAndDelete(ObjectId(id))
                return res.json({msg:'Category Deleted',category})
            } else {
                return res.json({msg:'No Category Found'})
            }
    }catch(err){
        console.log(err.message)
        res.status(500).send("Server error")
    }
})


//Update Category
router.post('/update', async (req, res) => {
    try {
        const { id, name,searchName, image } = req.body

        let category = await Category.findOne({_id:ObjectId(id)})
        console.log(category)
        if(!category){
            return res.json({msg:'No Category Found'})
        }
        category.name = name ? name : category.name
        category.searchName = searchName ? searchName : category.searchName
        category.image = image ? image : category.image

        await category.save()
        return res.json({msg:'Category Updated', category})
    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server error")
    }
})

module.exports = router