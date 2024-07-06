const Booking = require("../models/Booking")

exports.newBooking = async (req, res) => {
    try {

        const { userId, date, location, bookingSlot, alternateNumber, vehicleDetail } = req.body;


        if (!userId || !date || !bookingSlot || !alternateNumber) {
            if (!location.longitude || !location.lattitude || !vehicleDetail) {
                return res.status(500).json({
                    success: false,
                    message: "Enter all field of booking vehicle"
                })
            }
        }

        const booked_vehicle = await Booking.create({
            userId: userId,
            date: date,
            location: location,
            bookingSlot: bookingSlot,
            alternateNumber: alternateNumber,
            vehicleDetail: vehicleDetail,
            status: "Pending"
        })

        return res.status(200).json({
            success: true,
            message: "vehicle booked Successfully",
            data: booked_vehicle
        })


    } catch (error) {

        console.log("Error in Booking vehicle" + error)

        return res.status(500).json({
            success: false,
            message: error.message
        })


    }
}

exports.getUserBooking = async (req, res) => {

    try {

        const { userId } = req.body;

        if (!userId) {
            return res.status(500).json({
                success: false,
                message: "userId not found"
            })
        }

        const getBooking = await Booking.find({ userId });

        if (!getBooking) {
            return res.status(500), json({
                success: false,
                message: "Did not get user booking"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Booking data fetched Successfully ",
            data: getBooking
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: `Error in fetching user booking: ${error}`
        })

    }

}


exports.updateBooking = async (req, res) => {
    try {

        const { bookingId, date, location, bookingSlot, alternateNumber, status } = req.body;

        if (!bookingId) {
            return res.status(500).json({
                success: false,
                message: "bookingId not found"
            })
        }

        const booking = await Booking.findById({ _id: bookingId });
        console.log(booking);

        booking.alternateNumber = alternateNumber || booking.alternateNumber
        booking.location = location || booking.location
        booking.bookingSlot = bookingSlot || booking.bookingSlot
        booking.date = date || booking.date
        booking.status = status || booking.status

        await booking.save();

        return res.status(200).json({
            success: true,
            message: "booking updated"
        })



    } catch (error) {

        return res.status(500).json({
            success: true,
            message: `Error while updating booking ${error}`
        })

    }
}

exports.cancelBooking = async (req, res) => {
    try {

        const { bookingId } = req.body;

        if (!bookingId) {
            return res.status(500).json({
                success: false,
                message: "booking id not provided"
            })
        }

        const booking = await Booking.findById({ _id: bookingId });

        if (!booking) {
            return res.status(500).json({
                success: false,
                message: `No Booking found with the id: ${bookingId}`,
            })
        }

        booking.status = "Cancelled"
        await booking.save();


        return res.status(200).json({
            success: true,
            message: "Booking delete successfully",
            data: booking
        })



    } catch (error) {

        return res.status(500).json({
            success: false,
            message: `Error while deleting booking ${error}`
        })

    }
}