const User = require("../models/User");
const Worker = require("../models/worker");
const Booking = require("../models/Booking");
const Service = require("../models/Services");
const Brand = require("../models/Vehicle");
const Cars = require("../models/Cars");
const Bikes = require("../models/Bikes");
const CarServices = require("../models/Services");
const { uploadImageToCloudinary } = require("../utils/contentUploader");
const { models } = require("mongoose");
const BikeServices = require("../models/BikeServices");
const { model } = require("mongoose");

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
        const bookings = await Booking.find().populate([
            { path: 'bookedBy', select: 'userName phoneNo' }
        ]);

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

exports.createNewCarService = async (req, res) => {
    try {
        const { serviceName, desc, TnC } = req.body;

        const contentFiles = req.files.content

        if (!serviceName || !desc || !TnC || !contentFiles) {
            return res.status(404).json({
                success: false,
                message: "All fields are required",
            });
        }

        const service = await CarServices.findOne({ serviceName });

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



        const newService = await CarServices.create({
            serviceName,
            desc,
            TnC,
            images: uploadedContentUrls,
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

exports.createNewBikeService = async (req, res) => {
    try {
        const { serviceName, desc, TnC } = req.body;

        const contentFiles = req.files.content

        if (!serviceName || !desc || !TnC || !contentFiles) {
            return res.status(404).json({
                success: false,
                message: "All fields are required",
            });
        }

        const service = await BikeServices.findOne({ serviceName });

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



        const newService = await BikeServices.create({
            serviceName,
            desc,
            TnC,
            images: uploadedContentUrls,
        });

        return res.status(200).json({
            success: false,
            message: "New Bike service created successfully",
            data: newService
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error while creating new Bike services. Error:${error}`
        })
    }
};

exports.getAllCarServices = async (req, res) => {
    try {

        const carServices = await CarServices.find().populate([
            { path: 'brands', select: 'brand' }
        ]);

        if (!carServices) {
            return res.status(404).json({
                success: false,
                message: "Car services not found"
            })
        }

        return res.status(200).json({
            success: true,
            messsage: "Car services fetched successfully",
            data: carServices
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: `Error while fetching Bike services. Error: ${error}`
        })

    }
}

exports.getAllBikeServices = async (req, res) => {
    try {

        const bikeServices = await BikeServices.find();

        if (!bikeServices) {
            return res.status(404).json({
                success: false,
                message: "Bike services not found"
            })
        }

        return res.status(200).json({
            success: true,
            messsage: "Bike services fetched successfully",
            data: bikeServices
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: `Error while fetching Bike services. Error: ${error}`
        })

    }
}

exports.addCarToService = async (req, res) => {
    try {
        const { serviceId, brand, carName, modelDetails } = req.body;

        if (!serviceId || !brand || !carName || !Array.isArray(modelDetails) || modelDetails.length === 0) {
            return res.status(400).json({
                success: false,
                message: "All details are required, including a non-empty array of modelDetails"
            });
        }

        // Find the service by ID
        const service = await CarServices.findById(serviceId);
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
                    models: modelDetails // Add all models at once
                }]
            });
        } else {
            // Brand exists, check for the car
            let carIndex = service.brands[brandIndex].cars.findIndex(c => c.carName === carName);
            if (carIndex === -1) {
                // Car doesn't exist, create it
                service.brands[brandIndex].cars.push({
                    carName: carName,
                    models: modelDetails // Add all models at once
                });
            } else {
                // Car exists, add the models to the car
                modelDetails.forEach(modelDetail => {
                    let modelIndex = service.brands[brandIndex].cars[carIndex].models.findIndex(m => m.model === modelDetail.model);

                    if (modelIndex === -1) {
                        service.brands[brandIndex].cars[carIndex].models.push(modelDetail);
                    } else {
                        return res.status(500).json({
                            success: false,
                            message: `Model ${modelDetail.model} already exists for this car`
                        });
                    }
                });
            }
        }

        // Save the updated service document
        await service.save();

        return res.status(200).json({
            success: true,
            message: "Car models and prices added successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error while adding car models to service. Error: ${error}`
        });
    }
}




exports.addBikeToService = async (req, res) => {
    try {
        const { serviceId, brand, bikeName, modelDetails } = req.body;

        if (!serviceId || !brand || !bikeName || !Array.isArray(modelDetails) || modelDetails.length === 0) {
            return res.status(400).json({
                success: false,
                message: "All details are required, including a non-empty array of modelDetails"
            });
        }

        // Find the service by ID
        const service = await BikeServices.findById(serviceId);
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
                bikes: [{
                    bikeName: bikeName,
                    models: modelDetails // Add all models at once
                }]
            });
        } else {
            // Brand exists, check for the car
            let bikeIndex = service.brands[brandIndex].bikes.findIndex(c => c.bikeName === bikeName);
            if (bikeIndex === -1) {
                // Car doesn't exist, create it
                service.brands[brandIndex].bikes.push({
                    bikeName: bikeName,
                    models: modelDetails // Add all models at once
                });
            } else {
                // Car exists, add the models to the car
                modelDetails.forEach(modelDetail => {
                    let modelIndex = service.brands[brandIndex].bikes[bikeIndex].models.findIndex(m => m.model === modelDetail.model);

                    if (modelIndex === -1) {
                        service.brands[brandIndex].bikes[bikeIndex].models.push(modelDetail);
                    } else {
                        return res.status(500).json({
                            success: false,
                            message: `Model ${modelDetail.model} already exists for this car`
                        });
                    }
                });
            }
        }

        // Save the updated service document
        await service.save();

        return res.status(200).json({
            success: true,
            message: "Bike models and prices added successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error while adding car models to service. Error: ${error}`
        });
    }
}

