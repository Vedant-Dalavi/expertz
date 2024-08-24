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


// **********************************************************************************************************
//                                                  Create services
// **********************************************************************************************************

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
            success: true,
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
        const { serviceName, brand, carName, modelDetails } = req.body;

        if (!serviceName || !brand || !carName || !Array.isArray(modelDetails) || modelDetails.length === 0) {
            return res.status(400).json({
                success: false,
                message: "All details are required, including a non-empty array of modelDetails"
            });
        }

        // Find the service by ID
        const service = await CarServices.findOne({ serviceName });
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
                let duplicateModels = [];
                modelDetails.forEach(modelDetail => {
                    let modelIndex = service.brands[brandIndex].cars[carIndex].models.findIndex(m => m.model === modelDetail.model);

                    if (modelIndex === -1) {
                        service.brands[brandIndex].cars[carIndex].models.push(modelDetail);
                    } else {
                        duplicateModels.push(modelDetail.model);
                    }
                });

                if (duplicateModels.length > 0) {
                    return res.status(409).json({
                        success: false,
                        message: `The following models already exist for this car: ${duplicateModels.join(', ')}`
                    });
                }
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
            message: `Error while adding car models to service. Error: ${error.message}`
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
            // Brand exists, check for the bike
            let bikeIndex = service.brands[brandIndex].bikes.findIndex(b => b.bikeName === bikeName);
            if (bikeIndex === -1) {
                // Bike doesn't exist, create it
                service.brands[brandIndex].bikes.push({
                    bikeName: bikeName,
                    models: modelDetails // Add all models at once
                });
            } else {
                // Bike exists, add the models to the bike
                let duplicateModels = [];
                modelDetails.forEach(modelDetail => {
                    let modelIndex = service.brands[brandIndex].bikes[bikeIndex].models.findIndex(m => m.model === modelDetail.model);

                    if (modelIndex === -1) {
                        service.brands[brandIndex].bikes[bikeIndex].models.push(modelDetail);
                    } else {
                        duplicateModels.push(modelDetail.model);
                    }
                });

                if (duplicateModels.length > 0) {
                    return res.status(409).json({
                        success: false,
                        message: `The following models already exist for this bike: ${duplicateModels.join(', ')}`
                    });
                }
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
            message: `Error while adding bike models to service. Error: ${error.message}`
        });
    }
}

// **********************************************************************************************************
//                                                  Update services
// **********************************************************************************************************

exports.updateCarService = async (req, res) => {
    try {
        const { serviceName, newServiceName, desc, TnC } = req.body;

        const contentFiles = null


        const service = await CarServices.findOne({ serviceName });

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "This service does not exits"
            });
        }

        // upload images to cloudinary

        const uploadedContentUrls = [];

        if (contentFiles) {
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
        }


        if (newServiceName) {
            service.serviceName = newServiceName
        }

        if (desc) {
            service.desc = desc
        }

        if (TnC) {
            service.TnC = TnC
        }

        service.save();



        // const newService = await CarServices.create({
        //     serviceName,
        //     desc,
        //     TnC,
        //     images: uploadedContentUrls,
        // });



        return res.status(200).json({
            success: true,
            message: "Service Updated successfully",
            data: newService
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error updating services. Error:${error}`
        })
    }
};










