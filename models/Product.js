const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    promotionalPrice: {
        type: Number,
    },
    images: {
        type: [String],
    },
    createdAt: {
        type: Date, default: Date.now()
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "store",
    }
});


module.exports = Product = mongoose.model("product", ProductSchema);
