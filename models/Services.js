const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema({
    model: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
}, { _id: false });

const carSchema = new mongoose.Schema({
    carName: {
        type: String,
        required: true,
    },
    models: [modelSchema]
}, { _id: false });

const brandSchema = new mongoose.Schema({
    brand: {
        type: String,
        required: true,
    },
    cars: [carSchema],
}, { _id: false });

const carServiceSchema = new mongoose.Schema({
    serviceName: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    TnC: {
        type: String,
        required: true,
    },
    brands: [brandSchema],
    images: [
        {
            type: String,
            required: true,
        }
    ]
});

// Adding indexes for optimized querying
carServiceSchema.index({
    'brands.brand': 1,
    'brands.cars.carName': 1,
    'brands.cars.models.model': 1,
});

module.exports = mongoose.model("CarService", carServiceSchema);
