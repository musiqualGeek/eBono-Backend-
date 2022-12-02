const express = require('express')
const router  = express.Router();
const Stores = require('../../models/Stores')
const { ObjectId } = require('mongodb');


//Insert Stores
router.post("/create", async(req,res) => { 
    const {name,image} = req.body
    try{
            let store = null;
            store = new Stores({
                name:name
            })
            await store.save();   
            return res.json({msg:'Store Added', store})
    }catch(err){
        console.log(err.message)
        res.status(500).send("Server error")
    }
})


//Get All Stores
router.get("/", async(req,res) => { 
    try{
        const store = await Stores.find().sort({"name":1})
        if(store.length > 0){
            return res.json({store}) 
        } else {
            return res.json({msg:'No store Found'})
        }
    }catch(err){
        console.log(err.message)
        res.status(500).send("Server error")
    }
})



//Delete Stores
router.post('/delete', async(req,res) => {
    try{
        const {id} = req.body
        const st = await Stores.findById(ObjectId(id))
            if(st){
                const store = await Stores.findByIdAndDelete(ObjectId(id))
                return res.json({msg:'Store Deleted',store})
            } else {
                return res.json({msg:'No Store Found'})
            }
    }catch(err){
        console.log(err.message)
        res.status(500).send("Server error")
    }
})


//Update Stores
router.post('/update', async (req, res) => {
    try {
        const { id, name } = req.body

        let store = await Stores.findOne({_id:ObjectId(id)})
        console.log(store)
        if(!store){
            return res.json({msg:'No Store Found'})
        }
        store.name = name ? name : store.name

        await store.save()
        return res.json({msg:'Store Updated', store})
    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server error")
    }
})

module.exports = router