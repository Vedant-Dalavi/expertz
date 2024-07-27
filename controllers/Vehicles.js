const Vehicles = require('../models/Vehicle');
const User = require("../models/User")
const jwt = require("jsonwebtoken");

// ALL Vehicle Info
exports.VehiclesInfo = async (req, res) => {
    try {
        const vehicleData = await Vehicles.find();

        if (!vehicleData || vehicleData.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No Vehicles Found"
            });
        }


        return res.status(200).json({
            success: true,
            message: "Vehicles data fetched successfully",
            data: vehicleData
        });
    } catch (error) {
        console.log("Error while fetching vehicleData: " + error);
        return res.status(500).json({
            success: false,
            message: "Error while fetching vehicle data",
        });
    }
};

// Add Car to user v
exports.addCar = async (req, res) => {
    try {

        const { brand, vehicleName, vehicleNo, model } = req.body;

        const userId = req.user.id;

        if (!brand || !vehicleName || !model || !vehicleNo || !userId) {
            return res.status(206).json({
                success: false,
                message: "Enter full car details"
            })
        }

        newCar = { brand, vehicleName, vehicleNo, model };
        const user = await User.findByIdAndUpdate({ _id: userId },
            {
                $push:
                    { cars: newCar }
            });

        return res.status(200).json({
            success: true,
            message: "car updated successfully"
        })


    } catch (error) {

        console.log("Error in updating user cars" + error);
        return res.status(500).json({
            success: true,
            message: error,
        })

    }
}


exports.addBike = async (req, res) => {
    try {

        const { brand, vehicleName, vehicleNo, model } = req.body;

        const userId = req.user.id;

        if (!brand || !bikeName || !bikeNo || !model || !userId) {
            return res.send(206).json({
                success: false,
                message: "Enter full car details"
            })
        }

        if (!brand || !vehicleName || !model || !vehicleNo || !userId) {
            return res.status(206).json({
                success: false,
                message: "Enter full car details"
            })
        }

        newBike = { brand, vehicleName, vehicleNo, model };
        const user = await User.findByIdAndUpdate({ _id: userId },
            {
                $push:
                    { bikes: newBike }
            });

        return res.status(200).json({
            success: true,
            message: "Bike updated successfully",
            data: newBike
        })


    } catch (error) {
        console.log("Error in updating user bike");
        return res.status(500).json({
            success: true,
            message: error,
        })
    }
}