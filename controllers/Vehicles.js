const Brand = require('../models/Vehicle');
const User = require("../models/User")
const jwt = require("jsonwebtoken");

// 

// ALL Vehicle Info
exports.BrandInfo = async (req, res) => {
    try {
        const brandData = await Brand.find().populate([
            { path: "cars", select: "carName models" },
            { path: "bikes", select: "bikeName models" }
        ]);

        if (!brandData || brandData.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No Brand Found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Brand data fetched successfully",
            data: brandData,
        });
    } catch (error) {
        console.log("Error while fetching brandData: " + error);
        return res.status(500).json({
            success: false,
            message: `Error while fetching vehicle data Error: ${error}`,
        });
    }
};

// Add Car to user v
exports.addCar = async (req, res) => {
    try {

        const { brand, carName, carNo, model } = req.body;

        const userId = req.user.id;

        if (!brand || !carName || !model || !carNo || !userId) {
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


        newCar = { brand, carName, carNo, model };
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

        const { brand, bikeData, bikeNo, model } = req.body;

        const userId = req.user.id;

        if (!brand || !bikeData || !bikeNo || !model || !userId) {
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


        newBike = { brand, bikeData, bikeNo, model };
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

exports.getUserCar = async (req, res) => {
    try {

        const userId = req.user.id;

        if (!userId) {
            return res.json({
                success: false,
                message: "User not found"
            })
        }

        const user = await User.findById({ _id: userId });

        const userCar = user.cars;

        return res.status(200).json({
            success: true,
            message: "User cars fetched successfully",
            data: userCar
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            messsage: `Error while fetching User Cars Error: ${error}`
        })
    }
}

exports.getUserBike = async (req, res) => {
    try {

        const userId = req.user.id;

        if (!userId) {
            return res.json({
                success: false,
                message: "User not found"
            })
        }

        const user = await User.findById({ _id: userId });

        const userBike = user.bikes;

        return res.status(200).json({
            success: true,
            message: "User bike fetched successfully",
            data: userBike
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            messsage: `Error while fetching User bike Error: ${error}`
        })
    }
}