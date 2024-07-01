const Cars = require('../models/Cars');
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


}