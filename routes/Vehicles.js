// Import the required modules
const express = require("express")
const router = express.Router()

// Import the required controllers and middleware functions
const {
    VehiclesInfo,
    addCar,
    addBike,
    getUserCar
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
router.put("/add-car",auth, addCar);
router.put("/add-bike",auth, addBike);
router.get("/getusercar",auth,getUserCar);


//  ******************************************************************************************************
//                                  Booking Routes
// *******************************************************************************************************


router.post("/new-booking", newBooking);


module.exports = router