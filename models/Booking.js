const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    bookedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    serviceName: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        trim: true,
    },
    location:
    {
        lat: {
            type: String,
            // require:true
        },
        long: {
            type: String,
            // required:true
        }
    },
    bookingSlot: {
        type: String,
        // required: true
    },
    alternateNumber: {
        type: Number,
    },
    vehicleDetail:
    {
        brand: {
            type: String
        },
        vehicleName: {
            type: String,
        },
        model: {
            type: String
        },
        vehicleNo: {
            type: String
        }
    },
    acceptedBy: {
        type: mongoose.Schema.Types.ObjectId,
    },
    confirmCode: {
        type: String,
        // required: true
    },
    price: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: String,
        default: "Pending",
        enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
    }

})

module.exports = mongoose.model("Booking", bookingSchema)
