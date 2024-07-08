const User = require("../models/User")

exports.getAllUser = async (req, res) => {
    try {
        const getUser = await User.find();

        if (!getUser) {
            return res.status(404).json({
                success: false,
                message: "No User Registered"
            })
        }

        return res.status(200).json({
            success: true,
            message: "All User fetched Successfully",
            data: getUser
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: `Error while fetching all User ${error}`
        })

    }
}