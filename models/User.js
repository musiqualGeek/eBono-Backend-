const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    phone: {
        type: String,
    },
    password: {
        type: String,
    },
    type: {
        type: String,
        default:'New User'
    },
    address: {
        type: String
    },
    verified: {
        type: Boolean
    },
    signIn: {
        type: Boolean
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    profileImage: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    donationTitle: {
        type: String
    },
    requestingDonation: {
        type: String
    },
    merchant: {
        type: String
    },
    fcmToken: {
        type: String
    }
})

module.exports = User = mongoose.model('user', UserSchema)