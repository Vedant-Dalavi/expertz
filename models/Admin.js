const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    adminName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    phoneNo: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        // required: true,
    },
    accountType: {
        type: String,
        default: "Admin"
    },
    registeredOn: {
        type: Date,
        default: Date.now(),
    },
    token: {
        type: String
    }
});

module.exports = mongoose.model("Admin", adminSchema);