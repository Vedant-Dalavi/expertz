const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    bookedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: String, // or Date if you prefer to use Date objects
        required: true
    },
    serviceName: {
        type: String,
        required: true
    },
    location: {
        type: {
            type: String, // 'type' must be 'Point'
            enum: ['Point'], // Must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number], // Array of numbers: [longitude, latitude]
            required: true
        }
    },
    bookingSlot: {
        type: String,
        required: true
    },
    alternateNumber: {
        type: Number,
        required: true
    },
    vehicleDetail: {
        brand: String,
        vehicleName: String,
        model: String,
        vihicleNo: String,
    },
    price: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'Pending' // Or whatever default status you want
    },
    acceptedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    confirmCode: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Booking', BookingSchema);
