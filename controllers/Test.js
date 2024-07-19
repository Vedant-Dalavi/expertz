
exports.loadHomepage = async (req, res) => {
    try {
        res.render("homepage");
    } catch (error) {
        console.error("Error rendering homepage:", error);
        res.status(500).send("Internal Server Error");
    }
};

exports.uploadImg = async (req, res) => {
    try {
        console.log("body: ", req.body);
        console.log("file: ", req.file);

        res.status(200).json({
            success: true,
            message: "Img Uploaded successfully",
            fileInfo: req.file
        })
        return res.redirect("/test");

    } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).send("Internal Server Error");
    }
};