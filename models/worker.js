const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema({
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
        type: Number,
        required: true
    },
    alternatePhoneNo: {
        type: Number,
    },
    email: {
        type: String,
        trim: true,
    },
    image: {
        type: String
    },
    dob: {
        type: Date,
        // required: true
    },
    addressProof: {
        address: {
            type: String,
            // required: true,
            trim: true
        },
        proof: {
            type: String,
            // required: true,
        }
    },
    designation: {
        type: String,
    },
    workingArea: {
        type: String,
        // required: true
    },
    password: {
        type: String,
        required: true
    },
    accountType: {
        type: String,
        default: "Worker"
    },
    booking: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking"
        }
    ],
    baseLocation: {
        lat: {
            type: String,
            // require:true
        },
        long: {
            type: String,
            // required:true
        }
    },
    accountType: {
        type: String,
        default: "Worker"
    },
    token: {
        type: String,
    },

}, {
    timestamps: true
})

module.exports = mongoose.model("Worker", workerSchema)


// designation
// working area
// 2 mobile no
// address proof