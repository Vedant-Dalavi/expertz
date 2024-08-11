const mongoose = require("mongoose");

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
        require: true,
    },
    brands: [
        {
            brand: {
                type: String,
            },
            bikes: [
                {
                    bikeName: {
                        type: String,
                    },
                    models: [
                        {
                            model: {
                                type: String,
                                // required: true
                            },
                            price: {
                                type: String,
                                // required: true
                            }
                        }
                    ]
                }
            ]
        }
    ],
    images: [
        {
            type: String,
            required: true
        }
    ]

});

module.exports = mongoose.model("BikeService", bikeServiceSchema);
