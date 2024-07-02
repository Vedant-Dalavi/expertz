const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    phoneNo: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
    },
    token: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
})

module.exports = mongoose.model("User", userSchema)