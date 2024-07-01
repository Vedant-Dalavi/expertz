const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

//auth
exports.auth = async (req, res, next) => {

    try {

        // extract token
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");

        // token missing 

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            })
        }


        // verify token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);

            console.log(decode);
            req.user = decode;

        } catch (error) {

            return res.status(401).json({
                success: false,
                message: "token is invalid"
            });

        }
        next();

    } catch (error) {
        console.log("Error in authentication : ", error);
        return res.status(500).json({
            success: false,
            message: "something went wrong while validating token"
        });

    }

}


// isStudent

exports.isStudent = async (res, req, next) => {

    try {

        // fetch the role of user from req body

        if (req.user.accountType !== "Student") {
            return res.status(401).json({
                success: false,
                message: "this is protected route for student only "
            });
        }

        next();

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "user role cannot be verified ,please try again later"
        });

    }

}

// iInstructor

exports.isInstructor = async (req, res, next) => {

    try {

        // fetch the role of user from req body

        if (req.user.accountType !== "Instructor") {
            return res.status(401).json({
                success: false,
                message: "this is protected route for Instructor only "
            });
        }

        next();

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "user role cannot be verified ,please try again later"
        });

    }

}




// isAdmin

exports.isAdmin = async (req, res, next) => {

    try {

        // fetch the role of user from req body
        // console.log(req.user.accountType);

        if (req.user.accountType !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "this is protected route for Admin only "
            });
        }
        next();

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "user role cannot be verified ,please try again later"
        });

    }

}
