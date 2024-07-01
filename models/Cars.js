const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        trim: true,
    },
    cars: [
        {
            carName: {
                type: String,
                required: true,
                trim: true,
            },
            color: {
                type: String,
                required: true,
                trim: true
            },
            models:
            {
                modelName: {
                    type: String,
                    required: true,
                }
            }

        }
    ]
})

module.exports = mongoose.model("Cars", carSchema)