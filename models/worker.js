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
    addressProof: [
        {
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

    ],
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
    registeredOn: {
        type: Date,
        default: Date.now(),
    },
    token: {
        type: String,
    },

})

module.exports = mongoose.model("Worker", workerSchema)


// designation
// working area
// 2 mobile no
// address proof