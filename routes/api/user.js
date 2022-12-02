const express = require('express')
const router = express.Router();
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config');
const { Mongoose, isValidObjectId } = require('mongoose');
const DonorForm = require('../../models/DonorForm');
const RecipientForm = require('../../models/RecipientForm');
const CharityForm = require('../../models/CharityForm');
const upload = require('../../middleware/upload');
const { baseUrl } = require('../../utils/url');
const sendEmail = require('../../middleware/email')
const sendNotifications = require('../../middleware/notification')

// Get User
router.get("/", auth, async (req, res) => {
    try {
        const url = baseUrl(req)
        const user = await User.findById(req.user.id).select('-password')
        user.profileImage = `${url}${user.profileImage}`
        res.json(user)
    } catch (err) {
        console.log(err.message)
        res.status(500).send('Server Error')
    }
})

// Add Profile
router.post("/update", upload.single('image'), auth, async (req, res) => {
    const { donationTitle, requestingDonation, firstName, lastName } = req.body
    try {
        console.log(req.file)
        var user = await User.findById(req.user.id)
        if (user) {
            user.donationTitle = donationTitle
            user.requestingDonation = requestingDonation
            user.profileImage = `uploads/image/${req.file.originalname}`
            user.firstName = firstName,
                user.lastName = lastName
        }
        console.log(user, 'SAVE')
        await user.save()
    } catch (err) {
        console.log(err)
        return res.status(500).send('Server Error')
    }
})

router.post("/donor-form", auth, async (req, res) => {
    const { firstName, lastName, state, donationType, email, priceCategory } = req.body
    try {
        let form = null;
        form = new DonorForm({
            firstName: firstName,
            lastName: lastName,
            state: state,
            donationType: donationType,
            email: email,
            priceCategory: priceCategory,
            user: req.user.id
        })
        await form.save();
        return res.json({ msg: 'Donor Details Added', form })
    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server error")
    }
})

router.get('/check-donor', auth, async (req, res) => {
    try {
        var checkForm = await DonorForm.find({ user: req.user.id })
        if (checkForm) {
            return res.json({ checkForm })
        } else {
            // return res.json({checkForm:[]})
        }
    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server error")
    }
})

router.post("/recipient-form", auth, async (req, res) => {
    const { firstName, lastName, address, landmark, zipcode, city, peopleToSupport, currentlyEmployed, income, otherWelfare, rent, childSupport, state, donationType, email, priceCategory } = req.body
    try {
        let form = null;
        form = new RecipientForm({
            firstName: firstName,
            lastName: lastName,
            address: address,
            landmark: landmark,
            zipcode: zipcode,
            city: city,
            peopleToSupport: peopleToSupport,
            currentlyEmployed: currentlyEmployed,
            income: income,
            otherWelfare: otherWelfare,
            rent: rent,
            childSupport: childSupport,
            state: state,
            email: email,
            priceCategory: priceCategory,
            user: req.user.id
        })
        await form.save();
        return res.json({ msg: 'Recipient Details Added', form })
    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server error")
    }
})

router.get('/check-recipient', auth, async (req, res) => {
    try {
        var checkForm = await RecipientForm.find({ user: req.user.id })
        if (checkForm) {
            return res.json({ checkForm })
        } else {
            // return res.json({checkForm:[]})
        }
    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server error")
    }
})


router.post("/charity-form", auth, async (req, res) => {
    const { firstName, lastName, charityRole, charityAuthorization, charityOrganization, email } = req.body
    try {
        let form = null;
        form = new CharityForm({
            firstName: firstName,
            lastName: lastName,
            charityRole: charityRole,
            charityAuthorization: charityAuthorization,
            charityOrganization: charityOrganization,
            email: email,
            user: req.user.id
        })
        await form.save();
        return res.json({ msg: 'Charity Details Added', form })
    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server error")
    }
})


router.get('/check-charity', auth, async (req, res) => {
    try {
        var checkForm = await CharityForm.find({ user: req.user.id })
        if (checkForm) {
            return res.json({ checkForm })
        } else {
            // return res.json({checkForm:[]})
        }
    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server error")
    }
})

//Update Device Token
router.post('/update-token', auth, async (req, res) => {
    var { fcmToken } = req.body
    try {
        var user = await User.findById(req.user.id)
        if (user) {
            user.fcmToken = fcmToken
        }
        await user.save()
        console.log('TOKEN UPDATED FOR',user)
        return res.json({ msg: 'Expo Token Updated' })
    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server error")
    } v
})


router.get('/sendmail', async (req, res) => {
    try {
        // const user = await User.find().select('fcmToken').select('-_id')
        // var newUser = user.map(val => {
        //     if(val.fcmToken !== undefined){
        //         return val.fcmToken
        //     }
        // })
        // var newArray =  newUser.filter(x => x!==undefined)
        // var user = await User.find({type:'Donor'})
       
        // var newUser = user.map(val => {
        //     if(val.fcmToken !== undefined){
        //         return val.fcmToken
        //     }
        // })
        var newArray =  [
            'ExponentPushToken[q74ZwfHgFCVCAnvpDLLQDC]',
            'ExponentPushToken[kJp-MbMkSCv-i3ZUt4YoTl]',
            'ExponentPushToken[uso9I-GzEDu5XNKl9BG7Px]'
        ]
 

        sendNotifications(newArray,'Testing','Ebono')

    } catch (err) {
        console.log(err)
    }
})


module.exports = router