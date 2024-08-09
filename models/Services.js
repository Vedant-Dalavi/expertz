const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
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
    vehicleType: {
        type: String,
        require: true,
        enum: ["Bike", "Car"]
    },
    brands: [
        {
            brand: {
                type: String,
            },
            cars: [
                {
                    carName: {
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

module.exports = mongoose.model("Service", serviceSchema);
