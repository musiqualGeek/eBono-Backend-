const mongoose = require('mongoose')

const CharityFormSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    charityRole: {
        type: String
    },
    charityAuthorization: {
        type: String,
    },
    email: {
        type: String
    },
    charityOrganization: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    }
})

module.exports = CharityForm = mongoose.model('charityformschema', CharityFormSchema)