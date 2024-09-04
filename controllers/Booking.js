const Booking = require("../models/Booking")
const User = require("../models/User");
const Worker = require("../models/worker");

const otpGenerator = require("otp-generator");
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId;




exports.newBooking = async (req, res) => {
    try {
        const { date, location, bookingSlot, serviceName, alternateNumber, vehicleDetail, price } = req.body;

        const userId = req.user.id;

        // Check for required fields
        if (!userId || !date || !bookingSlot || !alternateNumber || !location || !location.long || !location.lat || !vehicleDetail || !price) {
            return res.status(400).json({
                success: false,
                message: "Enter all fields of booking vehicle"
            });
        }

        // Format the location as a GeoJSON Point
        const formattedLocation = {
            type: "Point",
            coordinates: [parseFloat(location.long), parseFloat(location.lat)] // Ensure that the coordinates are numbers
        };

        // Create the booking with the formatted location
        const booked_vehicle = await Booking.create({
            bookedBy: userId,
            date,
            serviceName,
            location: formattedLocation,
            bookingSlot,
            alternateNumber,
            vehicleDetail,
            price
        });

        // Update the user's bookings array
        await User.findByIdAndUpdate(userId, {
            $push: {
                bookings: booked_vehicle._id
            }
        });

        return res.status(200).json({
            success: true,
            message: "Vehicle booked successfully",
            data: booked_vehicle
        });

    } catch (error) {
        console.error("Error in booking vehicle:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


exports.getUserBooking = async (req, res) => {

    try {

        const userId = req.user.id;

        if (!userId) {
            return res.status(500).json({
                success: false,
                message: "userId not found"
            })
        }

        // const getBooking = await Booking.find({ bookedBy:userId });
        const user = await User.findById({ _id: userId }).populate("bookings");
        const getBooking = user.bookings;

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


exports.getAllBooking = async (req, res) => {

    try {

        const bookings = await Booking.find().populate([
            { path: 'bookedBy', select: 'userName phoneNo' },
        ]);

        if (!bookings) {
            return res.status(404).json({
                success: false,
                message: "No Booking found In DB"
            })
        }

        return res.status(200).json({
            success: true,
            message: "All Booking fetched Successfully",
            bookings
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: `Error while fetching all bookings ${error}`
        })
    }
}


exports.confirmBooking = async (req, res) => {
    try {

        const { bookingId } = req.body;
        const workerId = req.worker.id;

        if (!bookingId || !workerId) {
            return res.status(404).json({
                success: false,
                message: "All field are Required"
            })
        }

        const worker = await Worker.findOne({ _id: workerId });

        if (!worker) {
            return res.status(404).json({
                success: false,
                message: "worker not found"
            })
        }

        const booking = await Booking.findByIdAndUpdate({ _id: bookingId });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            })


        }

        if (booking.status !== "Pending") {
            return res.status(400).json({
                success: false,
                message: "Booking already Confirmed"
            })
        }

        var code = otpGenerator.generate(4, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        booking.status = "Confirmed";
        booking.confirmCode = code;
        booking.acceptedBy = workerId

        await booking.save();

        worker.booking.push(bookingId);

        await worker.save();

        return res.status(200).json({
            success: true,
            message: "Booking Confirmed",
            booking,
        })


    } catch (error) {
        return res.status(200).json({
            success: false,
            message: `Error in Confirm Booking : ${error}`
        })

    }
}

exports.completeBooking = async (req, res) => {
    try {

        const { bookingId, confirmCode } = req.body;
        const workerId = req.worker.id;

        if (!bookingId || !workerId || !confirmCode) {
            return res.status(404).json({
                success: false,
                message: "All field are Required"
            })
        }

        const booking = await Booking.findById({ _id: bookingId });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            })
        }

        if (confirmCode === booking.confirmCode) {

            booking.status = "Completed"
            booking.save();

            return res.status(200).json({
                success: true,
                message: "Booking Completed Successfully",
            })
        }
        const code = booking.confirmCode
        return res.status(500).json({
            success: false,
            message: "Confirm Code do not match",
            EnteredCode: confirmCode,
            BookingCode: code,
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: `Error in Completing Booking`
        })

    }
}

exports.getAreaWisePendingBooking = async (req, res) => {
    try {
        const { location } = req.body;

        if (!location.lat || !location.long) {
            return res.status(404).json({

                success: false,
                message: "Location is required"
            })
        }

        const getPendingBooking = await Booking.find({
            "location": {
                "$geoWithin": {
                    "$centerSphere": [
                        [20.976662472375065, 77.77816310905204], // [latitude, longitude]
                        5 / 6378.1 // 5 km converted to radians
                    ]
                }
            },
            "status": "Pending"
        }).populate({
            path: "bookedBy",
            select: "userName phoneNo"
        })

        if (!getPendingBooking) {
            return res.status(400).json({
                success: false,
                message: "No booking found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Pending booking fetched successfully",
            data: getPendingBooking
        })
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: `Error while getting pendign bookings. Error:${error}`
        })

    }
}

exports.getWorkerConfirmedBooking = async (req, res) => {
    try {
        const workerId = req.worker.id;

        if (!workerId) {
            return res.status(404).json({
                success: false,
                message: "workerId not found"
            });
        }

        const confirmedBooking = await Booking.find({
            status: "Confirmed",
            acceptedBy: new ObjectId(workerId) // Use ObjectId to convert workerId properly
        }).populate({
            path: "bookedBy",
            select: "userName phoneNo"
        });

        res.status(200).json({
            success: true,
            message: "All Confirmed booking fetched successfully",
            data: confirmedBooking
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error while fetching confirmed booking. Error: ${error}`
        });
    }
};

exports.getWorkerCompletedBooking = async (req, res) => {
    try {
        const workerId = req.worker.id;

        if (!workerId) {
            return res.status(404).json({
                success: false,
                message: "workerId not found"
            });
        }

        const confirmedBooking = await Booking.find({
            status: "Completed",
            acceptedBy: new ObjectId(workerId) // Use ObjectId to convert workerId properly
        }).populate({
            path: "bookedBy",
            select: "userName phoneNo"
        });

        res.status(200).json({
            success: true,
            message: "All completed booking fetched successfully",
            data: confirmedBooking
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error while fetching confirmed booking. Error: ${error}`
        });
    }
};