const cloudinary = require('cloudinary').v2


exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
    const options = {
        folder,
        resource_type: "auto",
        transformation: [
            { quality: "auto:low" },  // Compress image/video
            { fetch_format: "auto" }  // Use optimal format
        ]
    };

    return await cloudinary.uploader.upload(file.tempFilePath, options);
}
