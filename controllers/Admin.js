const User = require("../models/User");
const Worker = require("../models/worker");
const Booking = require("../models/Booking");
const Service = require("../models/Services");
const Brand = require("../models/Vehicle");
const Cars = require("../models/Cars");
const Bikes = require("../models/Bikes");
const Services = require("../models/Services");
const { uploadImageToCloudinary } = require("../utils/contentUploader");
const { models } = require("mongoose");

require("dotenv").config();


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

// ****************************************************************************************************************************
//                                               Admin Car/Bike Controller
// ****************************************************************************************************************

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

// ****************************************************************************************************************************
//                                               Admin service Controller
// ****************************************************************************************************************

exports.createNewService = async (req, res) => {
    try {
        const { serviceName, desc, TnC, vehicleType } = req.body;

        const contentFiles = req.files.content

        if (!serviceName || !desc || !TnC || !vehicleType || !contentFiles) {
            return res.status(404).json({
                success: false,
                message: "All fields are required",
            });
        }

        const service = await Services.findOne({ serviceName });

        if (service) {
            return res.status(409).json({
                success: false,
                message: "This service already exists",
            });
        }


        // upload images to cloudinary

        const uploadedContentUrls = [];

        if (Array.isArray(contentFiles)) {
            for (const file of contentFiles) {
                const uploadedContent = await uploadImageToCloudinary(
                    file,
                    process.env.FOLDER_NAME
                );
                uploadedContentUrls.push(uploadedContent.url);
            }
        } else {
            const uploadedContent = await uploadImageToCloudinary(
                contentFiles,
                process.env.FOLDER_NAME
            );
            uploadedContentUrls.push(uploadedContent.url);
        }



        const newService = await Services.create({
            serviceName,
            desc,
            TnC,
            images: uploadedContentUrls,
            vehicleType,
        });

        return res.status(200).json({
            success: false,
            message: "New service created successfully",
            data: newService
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error while creating new services. Error:${error}`
        })
    }
};

exports.addCarToService = async (req, res) => {
    try {
        const { serviceId, brand, carName, modelDetail } = req.body;

        if (!serviceId || !brand || !carName || !modelDetail || !modelDetail.model || !modelDetail.price) {
            return res.status(400).json({
                success: false,
                message: "All details are required"
            });
        }

        // Find the service by ID
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        // Find the brand in the service or create a new one
        let brandIndex = service.brands.findIndex(b => b.brand === brand);
        if (brandIndex === -1) {
            // Brand doesn't exist, create it
            service.brands.push({
                brand: brand,
                cars: [{
                    carName: carName,
                    models: [modelDetail]
                }]
            });
        } else {
            // Brand exists, check for the car
            let carIndex = service.brands[brandIndex].cars.findIndex(c => c.carName === carName);
            if (carIndex === -1) {
                // Car doesn't exist, create it
                service.brands[brandIndex].cars.push({
                    carName: carName,
                    models: [modelDetail]
                });
            } else {
                // Car exists, add the model to the car
                service.brands[brandIndex].cars[carIndex].models.push(modelDetail);
            }
        }

        // Save the updated service document
        await service.save();

        return res.status(200).json({
            success: true,
            message: "Car model and price added successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error while adding car model to service. Error: ${error}`
        });
    }
}
