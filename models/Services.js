const mongoose = require("mongoose");

<<<<<<< HEAD
// const serviceSchema = new mongoose.Schema({
//   serviceName: {
//     type: String,
//     required: true,
//   },
//   desc:{
//     type:String,
//     required:true
//   },
//   TnC:{
//   }
// });
=======
const carServiceSchema = new mongoose.Schema({
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
>>>>>>> 086d7064df369385d6901b95c18c9fc7cad522c2

module.exports = mongoose.model("CarService", carServiceSchema);
