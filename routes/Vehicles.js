// Import the required modules
const express = require("express")
const router = express.Router()

// Import the required controllers and middleware functions
const {
    VehiclesInfo,
    addCar,
    addBike
} = require("../controllers/Vehicles")

const {
    newBooking
} = require("../controllers/Booking")


const { auth } = require("../middleware/auth")

// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      car routes
// ********************************************************************************************************

// get all cars
router.get("/", VehiclesInfo);


// insert a car/bike in user's cars/bike
router.put("/add-car", addCar);
router.put("/add-bike", addBike);


//  ******************************************************************************************************
//                                  Booking Routes
// *******************************************************************************************************


router.post("/new-booking", newBooking);


module.exports = router