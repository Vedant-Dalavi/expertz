const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    phoneNo: {
        type: Number,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
    },
    vehicle: [
        {
            brand: {
                type: String
            },
            vehicleName: {
                type: String
            },
            model: {
                type: String
            },
            vehicleNo: {
                type: String
            }
        }
    ],
    bookings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking"
        }
    ],
    registeredOn: {
        type: Date,
        default: Date.now()
    },
    accountType: {
        type: String,
        default: "User"
    },
    address:[
        {
            type:String,
        }
    ],
    token: {
        type: String,
    }
})

module.exports = mongoose.model("User", userSchema)