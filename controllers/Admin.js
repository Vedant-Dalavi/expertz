const User = require("../models/User");
const Worker = require("../models/worker");
const Booking = require("../models/Booking");
const Service = require("../models/Services");
const { uploadMultipleFiles } = require('../utils/UploadMultipleFile');


exports.getAllUser = async (req, res) => {
    try {
        const users = await User.find();

        if (!users) {
            return res.status(404).json({
                success: false,
                message: "No user found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "All user fetched Successfully",
            users,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error while fetching all user : ${error}`,
        });
    }
};
exports.getAllWorker = async (req, res) => {
    try {
        const workers = await Worker.find();

        if (!workers) {
            return res.status(404).json({
                success: false,
                message: "No worker found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "All Worker fetched Successfully",
            workers,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error while fetching all Workers : ${error}`,
        });
    }
};
exports.getAllBooking = async (req, res) => {
    try {
        const bookings = await Booking.find();

        if (!bookings) {
            return res.status(404).json({
                success: false,
                message: "No bookings found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "All Bookings fetched Successfully",
            bookings,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error while fetching all Bookings : ${error}`,
        });
    }
};

exports.createNewService = async (req, res) => {
    try {
        const { serviceName, requiredTime, serviceInfo, includes, price } = req.body;
        const images = req.files.images;
        console.log("Step 1");

        if (!serviceName || !requiredTime || !serviceInfo || !includes || !price || !images) {
            return res.status(404).json({
                success: false,
                message: "All details are required",
            });
        }

        const imageUrls = await uploadMultipleFiles(images);
        console.log("Step 8")
        const service = await Service.create({
            serviceName,
            requiredTime,
            serviceInfo,
            includes,
            price,
            images: imageUrls // Store the URLs in the service
        });
        console.log("Step 9")

        res.status(201).json({
            success: true,
            data: service
        });
    } catch (error) {
        console.error("Error creating service: ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
