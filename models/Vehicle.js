const mongoose = require("mongoose");
const Cars = require("../models/Cars")
const Bikes = require("../models/Bikes")

const vehicleSchema = new mongoose.Schema({
    brand: {
        type: String,
        required: true,
        trim: true,
    },
    cars: [{
        carName: {
            type: String,
            required: true,
            trim: true,
        },
        models: [
            {
                type: String,
            }
        ]
    }
    ],
    bikes: [
        {
            bikeName: {
                type: String,
                required: true,
                trim: true,
            },
            models: [
                {
                    model: {
                        type: String,
                        required: true,
                    }
                }
            ]

        }
    ],
})

module.exports = mongoose.model("Vehicles", vehicleSchema)