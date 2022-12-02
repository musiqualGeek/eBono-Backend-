const mongoose = require("mongoose");

const StoreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  }
});

module.exports = Stores = mongoose.model("store", StoreSchema);