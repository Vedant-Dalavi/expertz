const User = require("../models/User");
const Worker = require("../models/worker");
const Booking = require("../models/Booking");
const Service = require("../models/Services");
const { uploadMultipleFiles } = require("../utils/UploadMultipleFile");
const Brand = require("../models/Vehicle");
const Cars = require("../models/Cars");
const Bikes = require("../models/Bikes");

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



exports.addVehicleBrand = async (req, res) => {
    try {

        const { brand } = req.body;

        if (!brand) {
            return res.status(404).json({
                success: false,
                message: "brand Not found"
            })
        }

        const checkBrand = await Brand.findOne({ brand });

        if (checkBrand) {
            return res.status(500).json({
                success: false,
                message: `brand already exits : brand:${checkBrand}`
            })
        }

        const newBrand = await Brand.create({
            brand
        })

        return res.status(200).json({
            success: false,
            message: "New brand added Successfully",
            newBrand
        })


    } catch (error) {

        return res.status(200).json({
            success: false,
            message: `Error while adding brand. Error : ${error}`,
        })

    }
}

exports.addBrandCar = async (req, res) => {
    try {

        const { brandId, carName, models } = req.body;

        if (!brandId || !carName || !models) {
            return res.status(404).json({
                success: false,
                message: "All fields are required"
            })
        }

        const isBrand = await Brand.findById({ _id: brandId }).populate("brand");

        if (!isBrand) {
            return res.status(404).json({
                success: false,
                message: "brand not found"
            })
        }

        const isCar = await Cars.findOne({ carName });

        if (isCar) {
            return res.status(500).json({
                success: false,
                message: "Car with same name already exits"
            })
        }

        const newCar = await Cars.create({
            brand: isBrand.brand,
            carName,
            models
        })

        const updateBrandCar = await Brand.findByIdAndUpdate({ _id: brandId }, {
            $push: {
                cars: newCar._id,
            }
        })

        isBrand.save();



        return res.status(200).json({
            success: true,
            message: "New car added successfully"
        })



    } catch (error) {
        return res.status(500).json({
            success: true,
            message: `Error while adding new car in  admin. Error: ${error}`
        })



    }
}

exports.addBrandBike = async (req, res) => {
    try {

        const { brandId, bikeName, models } = req.body;

        if (!brandId || !bikeName || !models) {
            return res.status(404).json({
                success: false,
                message: "All fields are required"
            })
        }

        const isBrand = await Brand.findById({ _id: brandId }).populate("brand");

        if (!isBrand) {
            return res.status(404).json({
                success: false,
                message: "brand not found"
            })
        }

        const isBike = await Bikes.findOne({ bikeName });

        if (isBike) {
            return res.status(500).json({
                success: false,
                message: "Car with same name already exits"
            })
        }

        const newBike = await Bikes.create({
            brand: isBrand.brand,
            bikeName,
            models
        })

        const updateBrandCar = await Brand.findByIdAndUpdate({ _id: brandId }, {
            $push: {
                bikes: newBike._id,
            }
        })
        isBrand.save();



        return res.status(200).json({
            success: true,
            message: "New car added successfully"
        })



    } catch (error) {
        return res.status(500).json({
            success: true,
            message: `Error while adding new car in  admin. Error: ${error}`
        })



    }
}

exports.getAllBrand = async (req, res) => {

    try {

        const brand = await Brand.find().populate([
            { path: "cars", select: "carName models" },
            { path: "bikes", select: "bikeName models" }
        ]);

        if (!brand) {
            return res.status(404).json({
                success: false,
                message: "No Brand Found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "All Brand fetched Successfully",
            data: brand
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: `Error while fetching all brands. Error : ${error}`
        })

    }

}

