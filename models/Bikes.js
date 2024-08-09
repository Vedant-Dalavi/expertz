const mongoose = require("mongoose");

const bikeSchema = new mongoose.Schema({
    brand: {
        type: String,
        require: true
    },
    bikeName: {
        type: String,
        required: true,
        trim: true,
    },
    models: [
        {
            type: String,
            required: true,
        }
    ]
})

module.exports = mongoose.model("Bikes", bikeSchema)