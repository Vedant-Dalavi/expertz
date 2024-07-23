const bcrypt = require("bcrypt");
const User = require("../models/User");
const OTP = require("../models/OTP");
const Worker = require("../models/worker");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const Admin = require("../models/Admin");
// const mailSender = require("../utils/mailSender");
// const { passwordUpdated } = require("../mail/templates/passwordUpdate");
// const Profile = require("../models/Profile");
require("dotenv").config();
// send otp

// Send OTP For Email Verification
exports.sendotp = async (req, res) => {
    try {
        const { phoneNo } = req.body;

        // Check if user is already present
        // Find user with provided email
        const checkUserPresent = await User.findOne({ phoneNo });
        // to be used in case of signup

        // If user found with provided email
        // if (checkUserPresent) {
        //     // Return 401 Unauthorized status code with error message
        //     return res.status(401).json({
        //         success: false,
        //         message: `User is Already Registered`,
        //     });
        // }

        var otp = otpGenerator.generate(4, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        const result = await OTP.findOne({ otp: otp });
        console.log("Result is Generate OTP ");
        console.log("OTP", otp);
        console.log("Result", result);
        while (result) {
            otp = otpGenerator.generate(4, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
        }
        const otpPayload = { phoneNo, otp };
        const otpBody = await OTP.create(otpPayload);
        console.log("OTP Body", otpBody);
        res.status(201).json({
            success: true,
            message: `OTP Sent Successfully`,
            otp,
        });
    } catch (error) {
        console.log("Error in OTP controller" + error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { otp, phoneNo } = req.body;

        if (!otp) {
            return res.status(505).json({
                success: false,
                message: "fill otp",
            });
        }

        const recentOtp = await OTP.findOne({ phoneNo })
            .sort({ createdAt: -1 })
            .limit(1);

        console.log(recentOtp);
        // validate OTP
        if (!recentOtp) {
            return res.status(401).json({
                success: false,
                message: "OTP Not Found",
            });
        } else if (otp !== recentOtp.otp) {
            return res.status(401).json({
                success: false,
                message: "OTP does not match",
            });
        }

        const user = await User.findOne({ phoneNo });
        console.log(user);
        if (!user) {
            return res.send({
                success: true,
                message: "user is not registered",
                data: false,
            });
        }

        //    generate token
        const token = jwt.sign(
            { email: user.phoneNo, id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "10h" }
        );

        user.token = token;
        user.password = undefined;

        const options = {
            expiresIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };

        // generate cookie and send response
        res.cookie("token", token, options).status(200).json({
            success: true,
            message: "User logged in successfully",
            token: token,
            user: user,
        });
    } catch (error) {
        console.log("Error in verifying OTP" + error);

        return res.status(500).json({
            success: false,
            message: "OTP verification failed",
        });
    }
};

// signUp
exports.signup = async (req, res, next) => {
    try {
        // fetch data from req body

        const { userName, email, phoneNo } = req.body;

        // validate data

        if (!userName || !phoneNo) {
            return res.status(206).json({
                success: false,
                message: "Please fill all the fields",
            });
        }

        // check if user exists or not

        const existingUser = await User.findOne({ phoneNo });

        if (existingUser) {
            return res.status(401).json({
                success: false,
                message: "User already registered"
            })
        }


        const user = await User.create({
            userName,
            email,
            phoneNo,
            image: `https://api.dicebear.com/8.x/initials/svg?seed=${userName}`,
        });

        const token = jwt.sign(
            { phoneNo: user.phoneNo, id: user._id, accountType: user.accountType },
            process.env.JWT_SECRET,
            { expiresIn: "10h" }
        );

        user.token = token;
        user.password = undefined;

        const options = {
            expiresIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };

        return res.status(200).json({
            success: true,
            message: "User registered Successfully",
            user,
        });
    } catch (error) {
        console.log("Error in creating user : ", error.message);
        return res.status(500).json({
            success: false,
            message: "user can not register please try again later",
        });
    }
};

// login

exports.login = async (req, res, next) => {
    try {
        // fetch data from body

        const { phoneNo, otp } = req.body;

        // validate data

        if (!phoneNo || !otp) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields",
            });
        }

        const recentOtp = await OTP.findOne({ phoneNo })
            .sort({ createdAt: -1 })
            .limit(1);

        console.log(recentOtp);
        // validate OTP
        if (recentOtp.length === 0) {
            return res.status(404).json({
                success: false,
                message: "OTP Not Found",
            });
        } else if (otp !== recentOtp.otp) {
            return res.status(401).json({
                success: false,
                message: "OTP does not match",
            });
        }

        // check if user exists or not

        const user = await User.findOne({ phoneNo });
        // .populate("additionalDetails");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User is not registered please sign up first",
            });
        }


        //    generate token
        const token = jwt.sign(
            { phoneNo: user.phoneNo, id: user._id, accountType: user.accountType },
            process.env.JWT_SECRET,
            { expiresIn: "10h" }
        );

        user.token = token;
        user.password = undefined;

        const options = {
            expiresIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };

        // generate cookie and send response
        res.cookie("token", token, options).status(200).json({
            success: true,
            message: "User logged in successfully",
            token: token,
            user: user,
        });

    } catch (error) {
        console.log("Error in login", error.message);
        return res.status(500).json({
            success: false,
            message: `login failed please try again: ${error}`,
        });
    }
};

// change password

exports.changePassword = async (req, res) => {
    try {
        // Get user data from req.user
        const userDetails = await User.findById(req.user.id);

        // Get old password, new password, and confirm new password from req.body
        const { oldPassword, newPassword, confirmNewPassword } = req.body;

        // Validate old password
        const isPasswordMatch = await bcrypt.compare(
            oldPassword,
            userDetails.password
        );
        if (!isPasswordMatch) {
            // If old password does not match, return a 401 (Unauthorized) error
            return res
                .status(401)
                .json({ success: false, message: "The password is incorrect" });
        }

        // Match new password and confirm new password
        if (newPassword !== confirmNewPassword) {
            // If new password and confirm new password do not match, return a 400 (Bad Request) error
            return res.status(400).json({
                success: false,
                message: "The password and confirm password does not match",
            });
        }

        // Update password
        const encryptedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUserDetails = await User.findByIdAndUpdate(
            req.user.id,
            { password: encryptedPassword },
            { new: true }
        );

        // Send notification email
        try {
            const emailResponse = await mailSender(
                updatedUserDetails.email,
                passwordUpdated(
                    updatedUserDetails.email,
                    `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
                )
            );
            console.log("Email sent successfully:", emailResponse.response);
        } catch (error) {
            // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
            console.error("Error occurred while sending email:", error);
            return res.status(500).json({
                success: false,
                message: "Error occurred while sending email",
                error: error.message,
            });
        }

        // Return success response
        return res
            .status(200)
            .json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
        console.error("Error occurred while updating password:", error);
        return res.status(500).json({
            success: false,
            message: "Error occurred while updating password",
            error: error.message,
        });
    }
};

// Worker

exports.workerSignup = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            phoneNo,
            email,
            alternatePhoneNo,
            password,
            confirmPassword,
        } = req.body;

        if (
            !firstName ||
            !lastName ||
            !phoneNo ||
            !email ||
            !alternatePhoneNo ||
            !password ||
            !confirmPassword
        ) {
            return res.status(500).json({
                success: false,
                message: "Enter all details",
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords and confirm Password does not match",
            });
        }

        const existingUser = await Worker.findOne({ phoneNo });
        console.log("Existing User: " + existingUser)
        if (existingUser) {
            return res.status(401).json({
                success: false,
                message: "User already registered",
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newWorker = await Worker.create({
            firstName,
            lastName,
            phoneNo: phoneNo,
            alternatePhoneNo: alternatePhoneNo || "",
            email,
            password: hashPassword,
            image: `https://api.dicebear.com/8.x/initials/svg?seed=${firstName}${lastName}`,
        });

        return res.status(200).json({
            success: true,
            message: "User registered Successfully",
            newWorker,
        });
    } catch (error) {
        console.log("Error in creating worker : ", error.message);
        return res.status(500).json({
            success: false,
            message: "Worker can not register please try again later",
        });
    }
};

exports.workerLogin = async (req, res) => {
    try {
        const { phoneNo, password } = req.body;

        if (!phoneNo || !password) {
            return res.status(404).josn({
                success: false,
                message: "Enter all details",
            });
        }

        const user = await Worker.findOne({ phoneNo });

        if (await bcrypt.compare(password, user.password)) {
            //    generate token

            const token = jwt.sign(
                { phoneNo: user.phoneNo, id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: "10h" }
            );
            user.token = token;
            user.password = undefined;

            const options = {
                expiresIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            };

            // generate cookie and send response
            res.cookie("token", token, options).status(200).json({
                success: true,
                message: "User logged in successfully",
                token: token,
                user: user,
            });
        } else {
            return res.status(401).json({
                success: false,
                message: "Password is incorrect",
            });
        }
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: `Error in worker login: ${error}`,
        });
    }
};

// Admin 

exports.adminSignup = async (req, res, next) => {
    try {
        // fetch data from req body

        const { adminName, email, phoneNo, password, confirmPassword } = req.body;

        // validate data

        if (!adminName || !email || !phoneNo || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords and confirm Password does not match",
            });
        }

        const existingAdmin = await Admin.findOne({ email });
        console.log("Existing admin: " + existingAdmin)
        if (existingAdmin) {
            return res.status(401).json({
                success: false,
                message: "Admin already registered",
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newAdmin = await Admin.create({
            adminName,
            phoneNo,
            email,
            password: hashPassword,
            image: `https://api.dicebear.com/8.x/initials/svg?seed=${adminName}`,
        });

        return res.status(200).json({
            success: true,
            message: "User registered Successfully",
            newAdmin,
        });
    } catch (error) {
        console.log("Error in creating admin : ", error.message);
        return res.status(500).json({
            success: false,
            message: "Admin can not register please try again later",
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
        // .populate("additionalDetails");

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
                { email: admin.email, id: admin._id, accountType: "Admin" },
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
                message: "Admin logged in successfully",
                token: token,
                admin,
            });
        } else {
            return res.status(401).json({
                success: false,
                message: "Password is incorrect",
            });
        }
    } catch (error) {
        console.log("Error in admin login", error.message);
        return res.status(500).json({
            success: false,
            message: "Admin login failed please try again later",
        });
    }
};