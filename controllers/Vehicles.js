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

        const user = await User.findOne({ _id: userId });

        if ((!user)) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }


        newCar = { brand, vehicleName, vehicleNo, model };
        const userUpdate = await User.findByIdAndUpdate({ _id: userId },
            {
                $push:
                    { cars: newCar }
            }, { new: true });

        return res.status(200).json({
            success: true,
            message: "car Added successfully",
            data: user
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

        if (!brand || !vehicleName || !vehicleNo || !model || !userId) {
            return res.send(206).json({
                success: false,
                message: "Enter full car details"
            })
        }

        const user = await User.findOne({ _id: userId });

        if ((!user)) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }


        newBike = { brand, vehicleName, vehicleNo, model };
        const userUpdate = await User.findByIdAndUpdate({ _id: userId },
            {
                $push:
                    { bikes: newBike }
            });

        return res.status(200).json({
            success: true,
            message: "Bike Added successfully",
            data: user
        })


    } catch (error) {
        console.log("Error in updating user bike");
        return res.status(500).json({
            success: false,
            message: `Error while adding new Bike ${error}`,
        })
    }
}