const express = require("express");
const router = express.Router();
const Product = require("../../models/Product");
const { ObjectId } = require("mongodb");
const Request = require("../../models/Request");
const auth = require('../../middleware/auth');
//const doordash = require("doordash")
const sendEmail = require('../../middleware/email')
const sendNotifications = require('../../middleware/notification')




const DoorDashClient = require('@doordash/sdk')
const access_key = {
    "developer_id": "035d28b4-3806-436c-a104-1f836c1cbc39",
    "key_id": "633c1cd9-08fa-46c5-917c-47de06ec8ff9",
    "signing_secret": "gqS163I8pFFvVyaucwc2mVkyWx_6UMocc2wwIWWWcqk"
}

const client = new DoorDashClient.DoorDashClient(access_key)


//Recipient Request
router.post('/request', auth, async (req, res) => {
    const { title, productList, address, deliveryDate, totalPrice } = req.body
    try {
        // console.log(productList,'LIST')
        var currentUser = await User.findById(req.user.id)
        let request = null;
        // const prod = await Product.findById(ObjectId(product));
        // if (prod) {
        request = new Request({
            title: 'Recipient Request',
            recipient: req.user.id,
            deliveryAddress: address,
            deliveryDate: deliveryDate,
            status: 'Pending',
            totalPrice: totalPrice,
            productList: productList
        })
        // productList.map(s => {
        //     const newAddress = {
        //         product: s
        //     }
        //     request.productList.push(newAddress)
        // })
        console.log(request)
        await request.save();
        var user = await User.find({type:'Donor'})
        user.map(val => {
            sendEmail(val.email,currentUser.name,'Donate and Help','message')            
        })
        var newUser = user.map(val => {
            if(val.fcmToken !== undefined){
                return val.fcmToken
            }
        })
        var newArray =  newUser.filter(x => x!==undefined)
        // var newArray = [
        //     'ExponentPushToken[---jFLHMnCRFhm0hKRIUdC]'
        // ]
        console.log(newArray,'NEW ARRAY')
        sendNotifications(newArray,'Donor','A Recipient/Charity Just Posted A Request, Donate Now')
        return res.json({ msg: 'Request Added', request })
        // } else {
        //     res.status(404).send("Product Does Not Exist")
        // }
    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server error")
    }
})

//Get All User Request
router.get('/user-request/:status?', auth, async (req, res) => {
    try {
        if (req.params.status) {
            console.log(req.params.status, 'STATUS')
            const request = await Request.find({ recipient: { $eq: req.user.id }, status: { $eq: req.params.status } }).populate({
                path: 'productList.product',
                model: 'product'
            }).populate({
                path: 'productList.product',
                model: 'product'
            }).populate({
                path: 'productList.product.category',
                model: 'category'
            }).populate({
                path: 'productList.product.store',
                model: 'store'
            })
            if (request.length > 0) {
                return res.json({ request });
            } else {
                return res.json({ msg: "No Requests Found" });
            }
        } else {
            const request = await Request.find({ recipient: { $eq: req.user.id } }).populate({
                path: 'productList.product',
                model: 'product'
            }).populate({
                path: 'productList.product',
                model: 'product'
            }).populate({
                path: 'productList.product.category',
                model: 'category'
            }).populate({
                path: 'productList.product.store',
                model: 'store'
            })
            if (request.length > 0) {
                console.log(request, 'REQUEST')
                return res.json({ request });
            } else {
                return res.json({ msg: "No Requests Found" });
            }
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server error");
    }
})

//Get All Request
router.get("/:status?", async (req, res) => {
    try {
        console.log(req.params.status)
        if (req.params.status) {
            const request = await Request.find({ status: { $eq: req.params.status } }).populate({
                path: 'productList.product',
                model: 'product'
            }).populate({
                path: 'productList.product',
                populate: {
                    path: 'category',
                    model: 'category'
                }

            }).populate({
                path: 'productList.product',
                populate: {
                    path: 'store',
                    model: 'store'
                }
            })
            if (request.length > 0) {
                return res.json({ request })
            } else {
                return res.json({ msg: 'No Request Found' })
            }
        } else {
            const request = await Request.find().populate({
                path: 'productList.product',
                model: 'product'
            }).populate({
                path: 'productList.product',
                populate: {
                    path: 'category',
                    model: 'category'
                }

            }).populate({
                path: 'productList.product',
                populate: {
                    path: 'store',
                    model: 'store'
                }
            })
            if (request.length > 0) {
                return res.json({ request })
            } else {
                return res.json({ msg: 'No Request Found' })
            }
        }
    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server error")
    }
})


// Delete Request
router.post('/delete', async (req, res) => {
    try {
        const { id } = req.body
        const req = await Request.findById(ObjectId(id))
        if (req) {
            const request = await Request.findByIdAndDelete(ObjectId(id))
            return res.json({ msg: 'Request Deleted', request })
        } else {
            return res.json({ msg: 'No Request Found' })
        }
    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server error")
    }
})

//Generate Voucher (If Accepted, Update Donor with User Id who have accepted)

router.post('/accept-request', auth, async (req, res) => {
    try {
        const { requestId } = req.body
        var user = await User.findById(req.user.id)
        if (user.type === 'Donor') {
            const req = await Request.findById(ObjectId(requestId))
            if (!req) {
                return res.json({ msg: 'No Request Found' })
            }
            const recipientUser = await User.find({_id:req.recipient})
            var voucherCode = Math.random().toString(36).slice(2, 7);
            req.status = 'Accepted'
            req.donor = user._id
            req.voucher = voucherCode
            var pickup_address = "1000 4th Ave, Seattle, WA, 98104"
            var pick_phone = "+1 865-429-0029"
            var dadd = req.deliveryAddress ? req.deliveryAddress : "1000 4th Ave, Seattle, WA, 98104"
            var dphone = user.phone ? user.phone : "+1 865-429-0023"
            // const doorDashResp = client
            //     .createDelivery({
            //         external_delivery_id: voucherCode,
            //         pickup_address: pickup_address,
            //         pickup_phone_number: pick_phone,
            //         dropoff_address: dadd,
            //         dropoff_phone_number: "+1 865-429-0023",
            //     })
            //     .then(async (response) => {
            //         req.trackingURL = response.data.tracking_url
            //         await req.save()
            //         return res.json({
            //             msg: 'Request Accepted By Donor',
            //             tracking_url: response.data.tracking_url
            //         })
            //     })
            //     .catch(err => {
            //         console.log(err)
            //     });
            await req.save()
            console.log(recipientUser)
            if(recipientUser[0].fcmToken){
                console.log('ACCEPTED REQUEST', recipientUser)
                var newArray = []
                newArray.push(recipientUser[0].fcmToken)
                console.log('ACCEPTED REQUEST TOKEN', newArray)
                sendNotifications(newArray,'Good News','Your Request Was Just Accepted By A Donor')
                setTimeout(() => {
                    sendNotifications(newArray,'Doordash','Your Order Will Be Delivered By Doordash, Tracking URL will be generated soon')
                },30000)
            }
            return res.json({
                msg: 'Request Accepted By Donor',
                // tracking_url: response.data.tracking_url
            })
        } else {
            return res.status(401).send("Only Donor Can Accept Request")
        }


    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server error")
    }
})


router.post('/accept-requestcharity', auth, async (req, res) => {
    try {
        console.log('CHARITYYYYYYY')
        const { selectedOrg, totalAmount } = req.body
        var user = await User.findById(req.user.id)
        if (user.type === 'Donor') {
            var voucherCode = Math.random().toString(36).slice(2, 7);
            var req = new Request({
                title:selectedOrg,
                totalPrice:totalAmount,
                status:'Accepted',
                donor: user._id,
                voucher: voucherCode,
                fromCharity:true
            })
            await req.save()
            return res.json({msg:'Request Added'})
        } else {
            return res.status(401).send("Only Donor Can Accept Request")
        }


    } catch (err) {
        console.log(err)
        res.status(500).send("Server error")
    }
})





module.exports = router