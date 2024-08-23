const User = require("../models/User");
const Worker = require("../models/worker");
const Booking = require("../models/Booking");
const Service = require("../models/Services");
const Brand = require("../models/Vehicle");
const Cars = require("../models/Cars");
const Bikes = require("../models/Bikes");
const CarServices = require("../models/Services");
const { uploadImageToCloudinary } = require("../utils/contentUploader");
const { models } = require("mongoose");
const BikeServices = require("../models/BikeServices");
const { model } = require("mongoose");
const Admin = require("../models/Admin");

require("dotenv").config();

// **************************************************************************************************
//                                              Admin Login
// **************************************************************************************************

exports.adminRegister = async (req, res, next) => {
    try {
        // fetch data from req body

        const { adminName, email, phoneNo, password } = req.body;

        // validate data

        if (!adminName || !email || !phoneNo || !password) {
            return res.status(206).json({
                success: false,
                message: "Please fill all the fields",
            });
        }

        // check if user exists or not

        const existingUser = await Admin.findOne({ email });

        if (existingUser) {
            return res.status(401).json({
                success: false,
                message: "Admin already registered"
            })
        }

        const hashPassword = await bcrypt.hash(password, 10);


        const admin = await Admin.create({
            userName,
            email,
            phoneNo,
            password: hashPassword,
            image: `https://api.dicebear.com/8.x/initials/svg?seed=${userName}`,
        });


        const token = jwt.sign(
            { phoneNo: admin.phoneNo, id: admin._id, accountType: admin.accountType },
            process.env.JWT_SECRET,
            { expiresIn: "10h" }
        );

        admin.token = token;
        admin.password = undefined;

        const options = {
            expiresIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };

        return res.status(200).json({
            success: true,
            message: "User registered Successfully",
            admin,
        });
    } catch (error) {
        console.log("Error in creating user : ", error.message);
        return res.status(500).json({
            success: false,
            message: "admin can not register please try again later",
        });
    }
};

exports.adminLogin = async (req, res, next) => {
    try {
        // fetch data from body

        const { email, password } = req.body;

        // validate data

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields",
            });
        }

        // check if user exists or not

        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "User is not registered please sign up first",
            });
        }

        // check password

        if (await bcrypt.compare(password, admin.password)) {
            //    generate token
            const token = jwt.sign(
                { email: admin.email, id: admin._id },
                process.env.JWT_SECRET,
                { expiresIn: "10h" }
            );

            admin.token = token;
            admin.password = undefined;

            const options = {
                expiresIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            };

            // generate cookie and send response
            res.cookie("token", token, options).status(200).json({
                success: true,
                message: "User logged in successfully",
                token,
                admin,
            });
        } else {


            return res.status(401).json({
                success: false,
                message: "Password is incorrect",
            });
        }

    } catch (error) {
        console.log("Error in login", error.message);
        return res.status(500).json({
            success: false,
            message: `login failed please try again later ${error}`,
        });
    }
};


// *****************************************************************************************************
//                                               controllers
// *****************************************************************************************************

exports.getAllUser = async (req, res) => {
    try {
        const users = await User.find();

        if (!users) {
            return res.status(404).json({
                success: false,
                message: "No user found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "All user fetched Successfully",
            users,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error while fetching all user : ${error}`,
        });
    }
};
exports.getAllWorker = async (req, res) => {
    try {
        const workers = await Worker.find();

        if (!workers) {
            return res.status(404).json({
                success: false,
                message: "No worker found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "All Worker fetched Successfully",
            workers,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error while fetching all Workers : ${error}`,
        });
    }
};
exports.getAllBooking = async (req, res) => {
    try {
        const bookings = await Booking.find().populate([
            { path: 'bookedBy', select: 'userName phoneNo' }
        ]);

        if (!bookings) {
            return res.status(404).json({
                success: false,
                message: "No bookings found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "All Bookings fetched Successfully",
            bookings,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error while fetching all Bookings : ${error}`,
        });
    }
};





