const Cars = require('../models/Bikes');
const User = require("../models/User")
const jwt = require("jsonwebtoken");

exports.BikeInfo = async (req, res) => {

    try {

        const bikeData = await Cars.find();

        if (!bikeData) {
            return res.status(400).json({
                success: false,
                message: "No Cars Found"
            })
        }

        return res.status(200).json({
            success: true,
            messageg: "Car data fectched successfully",
            data: bikeData
        })

    }
    catch (error) {
        console.log("Error while fetchin bikedata" + error);
        return res.status(500).json({
            success: false,
            message: "Error while fetching car car data",

        })
    }


};

exports.addBike = async (req, res) => {
    try {

        const { brand, bikeName, bikeNo, model, userId } = req.body;

        if (!brand || !bikeName || !bikeNo || !model || !userId) {
            return res.send(206).json({
                success: false,
                message: "Enter full car details"
            })
        }

        const newBikes = { brand: brand, bikeName: bikeName, bikeNo: bikeNo, model: model };
        const user = await User.findByIdAndUpdate({ _id: userId }, { $push: { bikes: newBike } });


        return res.status(200).json({
            success: true,
            message: "Bike updated successfully"
        })


    } catch (error) {
        console.log("Error in updating user bike");
        return res.status(500).json({
            success: true,
            message: error,
        })
    }
}