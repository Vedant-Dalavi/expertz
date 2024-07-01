// Import the required modules
const express = require("express")
const router = express.Router()

// Import the required controllers and middleware functions
const {
    CarsInfo
} = require("../controllers/Cars")
// const {
//     resetPasswordToken,
//     resetPassword,
// } = require("../controllers/ResetPassword")

const { auth } = require("../middleware/auth")

// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

router.get("/get-car", CarsInfo);

module.exports = router