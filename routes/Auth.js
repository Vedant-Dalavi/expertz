// Import the required modules
const express = require("express")
const router = express.Router()

// Import the required controllers and middleware functions
const {
    login,
    signup,
    sendotp,
    verifyOtp,
    workerSignup,
    workerLogin

} = require("../controllers/Auth")

const { auth } = require("../middleware/auth")

const { getAllUser, getUserBooking } = require("../controllers/User")

const { getUserCar } = require("../controllers/Vehicles")
// const {
//     resetPasswordToken,
//     resetPassword,
// } = require("../controllers/ResetPassword")


// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                User  Authentication routes
// ********************************************************************************************************

// Route for user login
router.post("/login", login)

// Route for user signup
router.post("/signup", signup)

// Route for sending OTP to the user's email
router.post("/sendotp", sendotp)

//verify OTP
router.post("/verify-otp", verifyOtp);

router.get("/users", getAllUser);

// router.get("/users", getAllUser);



// ********************************************************************************************************
//                                     Worker Authentication Routes
// ********************************************************************************************************
router.post("/worker-signup", workerSignup);
router.post("/worker-login", workerLogin);





module.exports = router