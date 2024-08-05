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


exports.getUserCar = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!userId) {
            return res.status(404).json({
                success: false,
                message: "userId not found"
            })
        }

        const cars = await User.findById({ _id: userId }).populate("cars");

        return res.status(200).json({
            success: true,
            message: "User car fetched Successfully",
            data: cars
        })


    } catch (error) {

        return res.status(500).json({
            success: false,
            message: `error while user cars: error ${error}`,

        })

    }
}

// exports.getUserDetails = async (req, res) => {
//     try {

//         const userId = req.user.id;

//         if (!userId) {
//             return res.status(500).json({
//                 success: false,
//                 message: "userId not found"
//             })
//         }

//         const userDetail = await User.findById({ _id: userId });

//         if (!userDetail) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found with given userId"

//             })
//         }

//         return res.status(200).json({
//             success: true,
//             message: "User Details fetched Successfully".
//                 user
//         })

//     } catch (error) {

//         return res.status(500).json({
//             success: false,
//             message: `Error while fetching user details: ${error}`
//         })

//     }
// }

exports.getUserBooking = async (req, res) => {

    try {

        const userId = req.user.id;

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "userId not found"
            })
        }

        const user = await User.findById({ _id: userId }).populate("bookings");

        const userBooking = user.bookings;

        return res.status(200).json({
            success: true,
            message: "User booking fetched successfully",
            data: userBooking
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: `Error while fetching user Booking. Error: ${error}`
        })

    }

}