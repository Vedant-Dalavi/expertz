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
        const contentFiles = req.files?.content; // Handling file uploads

        // Check for all required fields
        if (!serviceName || !desc || !TnC || !contentFiles) {
            return res.status(400).json({
                success: false,
                message: "All fields (serviceName, desc, TnC, vehicleType, and images) are required",
            });
        }

        // Check if the service already exists
        const service = await CarServices.findOne({ serviceName });
        if (service) {
            return res.status(409).json({
                success: false,
                message: "This service already exists",
            });
        }

        // Upload images to Cloudinary
        const uploadedContentUrls = [];
        if (Array.isArray(contentFiles)) {
            for (const file of contentFiles) {
                const uploadedContent = await uploadImageToCloudinary(file, process.env.FOLDER_NAME);
                uploadedContentUrls.push(uploadedContent.url);
            }
        } else {
            const uploadedContent = await uploadImageToCloudinary(contentFiles, process.env.FOLDER_NAME);
            uploadedContentUrls.push(uploadedContent.url);
        }

        // Create new car service with only the basic fields (excluding brands)
        const newService = await CarServices.create({
            serviceName,
            desc,
            TnC,
            images: uploadedContentUrls,
            brands: [], // Keep brands empty for now
        });

        return res.status(201).json({
            success: true,
            message: "New service created successfully",
            data: newService,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error while creating new service. Error: ${error}`,
        });
    }
};

// *********************************************************************************
// *********************************************************************************

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

        // Validate input data
        if (!serviceName || !brand || !carName || !Array.isArray(modelDetails) || modelDetails.length === 0) {
            return res.status(400).json({ success: false, message: "All details are required, including non-empty modelDetails." });
        }

        // Find the service by serviceName
        let service = await CarServices.findOne({ serviceName });
        if (!service) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }

        // Find or create brand
        let brandData = service.brands.find(b => b.brand === brand);
        if (!brandData) {
            // Brand does not exist, create brand with car and models
            brandData = {
                brand,
                cars: [{
                    carName,
                    models: modelDetails // Add models directly since brand and car are new
                }]
            };
            service.brands.push(brandData); // Add new brand with car and models
        } else {
            // Brand exists, find or create car
            let carData = brandData.cars.find(c => c.carName === carName);
            if (!carData) {
                // Car does not exist, create car with models
                carData = {
                    carName,
                    models: modelDetails // Add models directly since car is new
                };
                brandData.cars.push(carData); // Add the new car to the existing brand
            } else {
                // Car exists, add new models (avoid duplicates)
                const existingModels = carData.models.map(m => m.model);
                const newModels = modelDetails.filter(md => !existingModels.includes(md.model));

                if (newModels.length === 0) {
                    return res.status(409).json({ success: false, message: "All models already exist" });
                }

                // Add new models to the existing car
                newModels.forEach(model => {
                    carData.models.push({
                        model: model.model,
                        price: model.price
                    });
                });
            }
        }

        // Save the updated service document
        await service.save();

        return res.status(200).json({ success: true, message: "Car and models added/updated successfully", data: service });

    } catch (error) {
        return res.status(500).json({ success: false, message: `Error: ${error.message}` });
    }
};


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
        const { serviceName, newServiceName, desc, TnC } = req.body; // Include vehicleType if needed
        const contentFiles = req.files?.content || null;

        // Find the service by serviceName
        const service = await CarServices.findOne({ serviceName });

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "This service does not exist"
            });
        }

        // Upload images if contentFiles are provided
        const uploadedContentUrls = [];
        if (contentFiles) {
            if (Array.isArray(contentFiles)) {
                for (const file of contentFiles) {
                    const uploadedContent = await uploadImageToCloudinary(file, process.env.FOLDER_NAME);
                    uploadedContentUrls.push(uploadedContent.url);
                }
            } else {
                const uploadedContent = await uploadImageToCloudinary(contentFiles, process.env.FOLDER_NAME);
                uploadedContentUrls.push(uploadedContent.url);
            }
            service.images = uploadedContentUrls; // Update images if any
        }

        // Update service fields if provided
        if (newServiceName) service.serviceName = newServiceName;
        if (desc) service.desc = desc;
        if (TnC) service.TnC = TnC;

        // Save the updated service
        await service.save();

        return res.status(200).json({
            success: true,
            message: "Service updated successfully",
            data: service // Return the updated service
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error updating service. Error: ${error.message}`
        });
    }
};

// *************************************************************************
// *************************************************************************




exports.updateModelPrice = async (req, res) => {
    try {
        const { serviceName, brandName, carName, modelName, newPrice } = req.body;

        // Validate required fields
        if (!serviceName || !brandName || !carName || !modelName || newPrice == null) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required (serviceName, brandName, carName, modelName, newPrice).',
            });
        }

        // Find and update the specific model's price
        const updatedService = await CarServices.findOneAndUpdate(
            {
                serviceName: serviceName, // Match the service
                'brands.brand': brandName, // Match the brand
                'brands.cars.carName': carName, // Match the car
                'brands.cars.models.model': modelName, // Match the model
            },
            {
                $set: {
                    'brands.$[brand].cars.$[car].models.$[model].price': newPrice, // Update the model price
                },
            },
            {
                arrayFilters: [
                    { 'brand.brand': brandName }, // Filter for brand
                    { 'car.carName': carName }, // Filter for car
                    { 'model.model': modelName }, // Filter for model
                ],
                new: true, // Return the updated document
            }
        );

        // Check if the update was successful
        if (!updatedService) {
            return res.status(404).json({
                success: false,
                message: 'Service, brand, car, or model not found.',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Model price updated successfully.',
            data: updatedService,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error while updating model price: ${error.message}`,
        });
    }
};

// *********************************************************************************
// *********************************************************************************

exports.deleteModel = async (req, res) => {
    try {
        const { serviceName, brandName, carName, modelName } = req.body;

        // Validate required fields
        if (!serviceName || !brandName || !carName || !modelName) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required (serviceName, brandName, carName, modelName).',
            });
        }

        // Find the service and remove the model
        const updatedService = await CarServices.findOneAndUpdate(
            {
                serviceName: serviceName, // Find the service by name
                'brands.brand': brandName, // Match the brand by name
                'brands.cars.carName': carName, // Match the car by name
            },
            {
                $pull: {
                    'brands.$[brand].cars.$[car].models': { model: modelName }, // Remove the specific model
                },
            },
            {
                arrayFilters: [
                    { 'brand.brand': brandName }, // Filter for the correct brand
                    { 'car.carName': carName }, // Filter for the correct car
                ],
                new: true, // Return the updated document
            }
        );

        // Check if the update was successful
        if (!updatedService) {
            return res.status(404).json({
                success: false,
                message: 'Service, brand, or car not found, or model does not exist.',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Model deleted successfully from the service.',
            data: updatedService, // Return the updated service document
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error while deleting model: ${error.message}`,
        });
    }
};













