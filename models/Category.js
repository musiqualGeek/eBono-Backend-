const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  image: {
    type: String,
    required: false,
  },
  searchName: {
    type: String,
    required:false,
  }
});

module.exports = Category = mongoose.model("category", CategorySchema);