const Service = require("../models/Services");


exports.newService = async (req, res) => {
    try {
        const { serviceName, price, includes, serviceInfo, requiredTime } = req;
        const imageFile = req.new_files

        console.log(req.files)
        console.log(req);

        if (!serviceName || !requiredTime || !serviceInfo || !includes || !price) {
            return res.status(404).json({
                success: false,
                message: `All details are required`,
            });
        }

        return res.status(200).json({
            succeess: true,
            body: req.bodyData,
            file: req.new_files

        })
    } catch (error) {
        return res.status(500).json({
            succeess: false,
            message: `${error}`

        })
    }
}