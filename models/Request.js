const mongoose = require("mongoose");


const RequestSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    productList: {
        type: [Object]
    },
    status: {
        type: String,
        enum: ['Pending','Accepted'],
        required:true
    },
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    voucher: {
        type: String
    },
    trackingURL: {
        type: String
    },
    deliveryAddress: {
        type: String
    },
    deliveryDate: {
        type: Date
    },
    totalPrice: {
        type: Number
    },
    fromCharity: {
        type: Boolean,
        default: false
    }
});


module.exports = Request = mongoose.model("request", RequestSchema);