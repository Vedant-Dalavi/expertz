const mongoose = require("mongoose");

const bikeModelSchema = new mongoose.Schema({
    model: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    }
}, { _id: false });

const bikeSchema = new mongoose.Schema({
    bikeName: {
        type: String,
        required: true,
    },
    models: [bikeModelSchema]
}, { _id: false });


const brandSchema = new mongoose.Schema({
    brand: {
        type: String,
        required: true,
    },
    bikes: [bikeSchema]
}, { _id: false });


const bikeServiceSchema = new mongoose.Schema({
    serviceName: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true
    },
    TnC: {
        type: String,
        required: true
    },
    brands: [brandSchema],
    images: [
        {
            type: String,
            required: true
        }
    ]
});


bikeServiceSchema.index({
    'brands.brand': 1,
    'brands.bikes.bikeName': 1,
    'brands.bikes.models.model': 1
});


module.exports = mongoose.model("BikeService", bikeServiceSchema);
