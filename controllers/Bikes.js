const Bikes = require('../models/Bikes');
// const Cars = require('../models/Bikes');
const User = require("../models/User")
// const jwt = require("jsonwebtoken");

exports.BikeInfo = async (req, res) => {

    try {

        const bikeData = await Bikes.find();

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

exports.deleteBike = async (req, res) => {
    try {
        const { bikeId } = req.body;  // Extract bikeId from the request body
        const userId = req.user.id;  // Get userId from the request user object

        if (!bikeId) {
            return res.status(400).json({
                success: false,
                message: "bikeId is required"
            });
        }

        // Update user by pulling the car with the specific carId from the cars array
        const updatedUser = await User.findByIdAndUpdate(
            userId,  // Find user by their ID
            { $pull: { bikes: { _id: bikeId } } },  // Remove bike object with the matching _id from bikes array
            { new: true }  // Return the updated user document
        );

        // Check if the user was found and the bike was removed
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found or bike not found in user's cars"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User bike Deleted Successfully",
            // data: updatedUser
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error While Deleting User bike. Error: ${error}`
        });
    }
};