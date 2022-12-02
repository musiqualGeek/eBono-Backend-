const express = require('express')
const router = express.Router();
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config');
const { Mongoose, isValidObjectId } = require('mongoose');
const AdminRequest = require('../../models/AdminRequest')

// Get User
router.get("/", async (req, res) => {
    try {
        const request = await AdminRequest.find()
        if (request.length > 0) {
            return res.json(request)
        } else {
            return res.json({ msg: 'Request Not Found' })
        }

    } catch (err) {
        console.log(err.message)
        res.status(500).send('Server Error')
    }
})

//Insert Categorys
router.post("/create", auth, async (req, res) => {
    const { donorPhone, requestType } = req.body
    try {
        var user = await User.findById(req.user.id)
        if(user){
            let request = null;
            request = new AdminRequest({
                donor:req.user.id,
                donorPhone:donorPhone,
                requestType:requestType
            })
            await request.save();
            return res.json({ msg: 'Request Added', request })
    
        }
    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server error")
    }
})


module.exports = router