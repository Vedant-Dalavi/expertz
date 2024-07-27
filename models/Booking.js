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
        }
    },
    acceptedBy: {
        type: mongoose.Schema.Types.ObjectId,
    },
    status: {
        type: String,
        enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
    }

})

module.exports = mongoose.model("Booking", bookingSchema)