const mongoose = require("mongoose");
const Cars = require("../models/Cars")
const Bikes = require("../models/Bikes")

const vehicleSchema = new mongoose.Schema({
    brand: {
        type: String,
        required: true,
        trim: true,
    },
    cars: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cars"
        }

    ],
    bikes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bikes"
        }


    ],
})

module.exports = mongoose.model("Brand", vehicleSchema)