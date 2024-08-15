const User = require("../../models/User");
const Worker = require("../../models/worker");
const Booking = require("../../models/Booking");
const Service = require("../../models/Services");
const Brand = require("../../models/Vehicle");
const Cars = require("../../models/Cars");
const Bikes = require("../../models/Bikes");
const CarServices = require("../../models/Services");
const { uploadImageToCloudinary } = require("../../utils/contentUploader");
const { models } = require("mongoose");
const BikeServices = require("../../models/BikeServices");
const { model } = require("mongoose");

require("dotenv").config();



exports.addVehicleBrand = async (req, res) => {
    try {
        const { brand } = req.body;

        if (!brand) {
            return res.status(404).json({
                success: false,
                message: "brand Not found",
            });
        }

        const checkBrand = await Brand.findOne({ brand });

        if (checkBrand) {
            return res.status(500).json({
                success: false,
                message: `brand already exits : brand:${checkBrand}`,
            });
        }

        const newBrand = await Brand.create({
            brand,
        });

        return res.status(200).json({
            success: false,
            message: "New brand added Successfully",
            newBrand,
        });
    } catch (error) {
        return res.status(200).json({
            success: false,
            message: `Error while adding brand. Error : ${error}`,
        });
    }
};

exports.addBrandCar = async (req, res) => {
    try {
        const { brand, carName, models } = req.body;

        if (!brand || !carName || !models) {
            return res.status(404).json({
                success: false,
                message: "All fields are required",
            });
        }

        const isBrand = await Brand.findOne({ brand }).populate("brand");

        if (!isBrand) {
            return res.status(404).json({
                success: false,
                message: "brand not found",
            });
        }

        const isCar = await Cars.findOne({ carName });

        if (isCar) {
            return res.status(500).json({
                success: false,
                message: "Car with same name already exits",
            });
        }

        const newCar = await Cars.create({
            brand,
            carName,
            models,
        });

        const updateBrandCar = await Brand.findOneAndUpdate(
            { brand },
            {
                $push: {
                    cars: newCar._id,
                },
            }
        );

        isBrand.save();

        return res.status(200).json({
            success: true,
            message: "New car added successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: true,
            message: `Error while adding new car in  admin. Error: ${error}`,
        });
    }
};

exports.addBrandBike = async (req, res) => {
    try {
        const { brand, bikeName, models } = req.body;

        if (!brand || !bikeName || !models) {
            return res.status(404).json({
                success: false,
                message: "All fields are required",
            });
        }

        const isBrand = await Brand.findOne({ brand }).populate("brand");

        if (!isBrand) {
            return res.status(404).json({
                success: false,
                message: "brand not found",
            });
        }

        const isBike = await Bikes.findOne({ bikeName });

        if (isBike) {
            return res.status(500).json({
                success: false,
                message: "Bike with same name already exits",
            });
        }

        const newBike = await Bikes.create({
            brand,
            bikeName,
            models,
        });

        const updateBrandCar = await Brand.findOneAndUpdate(
            { brand },
            {
                $push: {
                    bikes: newBike._id,
                },
            }
        );
        isBrand.save();

        return res.status(200).json({
            success: true,
            message: "New Bike added successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: true,
            message: `Error while adding new car in  admin. Error: ${error}`,
        });
    }
};

exports.getAllBrand = async (req, res) => {
    try {
        const brand = await Brand.find().populate([
            { path: "cars", select: "carName models" },
            { path: "bikes", select: "bikeName models" },
        ]);

        if (!brand) {
            return res.status(404).json({
                success: false,
                message: "No Brand Found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "All Brand fetched Successfully",
            data: brand,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error while fetching all brands. Error : ${error}`,
        });
    }
};