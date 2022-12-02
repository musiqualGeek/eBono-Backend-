const express = require('express')
const router = express.Router();
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const sendEmail = require('../../middleware/email')


router.post("/check-user",async (req,res) => {
    const {phone, type} = req.body
    try{
        let user = await User.findOne({ phone })
        if(user){
            if(user.type == type){
                return res.json({status:200, msg:'User Available with Type'})
            } else {
                return res.json({status:400, msg:`User With Type ${user.type} Exist`})
            }   
        } else {
            return res.json({status:200, msg:'User Not Registered'})
        }
    }catch(err){
        console.log(err.message)
        res.status(500).send("Server error")
    }
})

//Login User
router.post("/login", async (req, res) => {
    const { phone, verified, type, email } = req.body
    try {
        let user = await User.findOne({ email })
        if (user.phone) {
            const payLoad = {
                user: {
                    id: user.id
                }
            }
            jwt.sign(payLoad, 'mysecrettoken', { expiresIn: 36000 }, (err, token) => {
                if (err) {
                    throw err
                }
                return res.json({ msg:'User Logged In', token, user })
            })
        } else {
            user.phone = phone,
            // user.type = type
    
            // user = new User({
            //     phone,
            //     verified,
            //     type
            // })
            await user.save();
            const payLoad = {
                user: {
                    id: user.id
                }
            }
            jwt.sign(payLoad, 'mysecrettoken', { expiresIn: 36000 }, (err, token) => {
                if (err) {
                    throw err
                }
                res.json({ msg: 'User Registered With Phone', token, user })
            })

        }
        
    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server error")
    }
})

router.post("/email-login", async (req, res) => {
    const { email, password } = req.body
    try {
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Invalid email or password' }] })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: 'Invalid email or password' }] })
        }
        return res.json({ user })


    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server error")
    }
})


//REGISTER
router.post("/email-register", async (req, res) => {
    const { email, password, name, type } = req.body
    try {
        let user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ errors: [{ msg: 'User already exist' }] })
        }

        user = new User({
            email,
            password,
            name,
            type
        })

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt)
        await user.save();
        sendEmail(email,name,'Ebono Registration','email')
        if(type == 'Donor') {
            sendEmail(email,name,'Ebono Donor','donor')
        } else {
            sendEmail(email,name,'Ebono','charity')
        }
        return res.json({ user })


    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server error")
    }
})

module.exports = router