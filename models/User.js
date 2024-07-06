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
    token: {
        type: String,
    }
})

module.exports = mongoose.model("User", userSchema)