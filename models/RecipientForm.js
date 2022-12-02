const mongoose = require('mongoose')

const RecipeintFormSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String
    },
    address: {
        type: String,
    },
    landmark: {
        type: String
    },
    zipcode: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    peopleToSupport: {
        type: String
    },
    currentEmployed: {
        type: String
    },
    income: {
        type: String
    },
    otherWelfare: {
        type: String
    },
    rent: {
        type: String
    },
    childSupport: {
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

module.exports = RecipeintForm = mongoose.model('recipeintformschema', RecipeintFormSchema)