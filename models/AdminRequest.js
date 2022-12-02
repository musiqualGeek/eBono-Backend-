const mongoose = require("mongoose");

const AdminRequestSchema = new mongoose.Schema({
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    donorPhone: {
        type: String
    },
    requestType: {
        type: String
    },
    requestStatus: {
        type: Boolean,
        enum: [
            true,
            false
        ],
        default:false
    }
});

module.exports = AdminRequest = mongoose.model("adminrequest", AdminRequestSchema);