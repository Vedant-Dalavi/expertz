const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
    brand:{
        type:String,
        require:true
    },
    carName: {
        type: String,
        required: true,
        trim: true,
    },
    models: [
        {
            type: String,
            required: true
        }
    ]

})

module.exports = mongoose.model("Cars", carSchema)