const Cars = require('../models/Cars');
const User = require("../models/User")
const jwt = require("jsonwebtoken");

exports.CarsInfo = async (req, res) => {

    try {

        const carData = await Cars.find();

        if (!carData) {
            return res.status(400).json({
                success: false,
                message: "No Cars Found"
            })
        }

        return res.status(200).json({
            success: true,
            messageg: "Car data fectched successfully",
            data: carData
        })

    }
    catch (error) {
        console.log("Error while fetchin carData" + error);
        return res.status(500).json({
            success: false,
            message: "Error while fetching car data",

        })

    }

};

exports.addCar = async (req, res) => {
    try {

        const { brand, carName, carNo, model, userId } = req.body;

        if (!brand || !carName || !model || !carNo || !userId) {
            return res.status(206).json({
                success: false,
                message: "Enter full car details"
            })
        }

        newCar = { brand: brand, carName: carName, carNo: carNo, model: model };
        const user = await User.findByIdAndUpdate({ _id: userId }, { $push: { cars: newCar } });

        return res.status(200).json({
            success: true,
            message: "car updated successfully"
        })


    } catch (error) {

        console.log("Error in updating user cars");
        return res.status(500).json({
            success: true,
            message: error,
        })

    }
}

exports.deleteCar = async (req, res) => {
    try {
        const { carId } = req.body;  // Extract carId from the request body
        const userId = req.user.id;  // Get userId from the request user object

        if (!carId) {
            return res.status(400).json({
                success: false,
                message: "carId is required"
            });
        }

        // Update user by pulling the car with the specific carId from the cars array
        const updatedUser = await User.findByIdAndUpdate(
            userId,  // Find user by their ID
            { $pull: { cars: { _id: carId } } },  // Remove car object with the matching _id from cars array
            { new: true }  // Return the updated user document
        );

        // Check if the user was found and the car was removed
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found or car not found in user's cars"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User Car Deleted Successfully",
            // data: updatedUser
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error While Deleting User Car. Error: ${error}`
        });
    }
};
