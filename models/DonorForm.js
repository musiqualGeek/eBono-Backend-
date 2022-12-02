const mongoose = require('mongoose')

const DonorFormSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    state: {
        type: String
    },
    donationType: {
        type: String,
    },
    email: {
        type: String
    },
    priceCategory: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    }
})

module.exports = DonorForm = mongoose.model('donorformschema', DonorFormSchema)