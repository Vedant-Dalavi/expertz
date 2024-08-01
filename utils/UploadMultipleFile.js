// server/utils/UploadMultipleFile.js
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

// Utility function to remove file after upload
const removeFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to remove file:", err);
    });
};

// Upload function for a single file
const uploadFile = (filePath, resourceType) => {
    console.log("Step 3")
    const isImage = resourceType === "image";
    const transformation = isImage
        ? [{ width: 800, height: 600, crop: "limit" }, { quality: "auto" }]
        : [
            { width: 1280, height: 720, crop: "limit" },
            { video_codec: "auto" },
            { quality: "auto" },
        ];
    console.log("step 4")
    return cloudinary.uploader.upload(filePath, {
        resource_type: resourceType,
        transformation,
    });
};

// Function to handle multiple file uploads
exports.uploadMultipleFiles = async (files) => {
    console.log("step 2")
    const uploadPromises = () => {
        const fileType = files.mimetype.split("/")[0];
        if (fileType !== "image" && fileType !== "video") {
            throw new Error("Unsupported file type");
        }
        return uploadFile(files.path, fileType).then((result) => {
            console.log("Step 6")
            removeFile(files.path); // Clean up the temporary file
            return result.secure_url;
        });
    };

    return Promise.all(uploadPromises);
};
