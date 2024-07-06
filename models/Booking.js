const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    date: {
        type: String,
        trim: true,
    },
    location:
    {
        longitude: {
            type: Number,
            // required: true

        },
        lattitude: {
            type: Number,
            // required: true

        }
    },
    bookingSlot: {
        type: String,
        // required: true
    },
    alternateNumber: {
        type: String,
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
    status: {
        type: String,
        enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
    }

})

module.exports = mongoose.model("Booking", bookingSchema)


// booking slot
// time
// alternate mobile num
// vehicle detail

