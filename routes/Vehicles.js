// Import the required modules
const express = require("express")
const router = express.Router()

// Import the required controllers and middleware functions
const {
    VehiclesInfo,
    addCar,
    addBike,
    getUserCar,
    getUserBike,
    BrandInfo
} = require("../controllers/Vehicles")

const {
    newBooking
} = require("../controllers/Booking")



const { auth } = require("../middleware/auth")
const { deleteCar } = require("../controllers/Cars")

// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      car routes
// ********************************************************************************************************

// get all cars
router.get("/", BrandInfo);


// insert a car/bike in user's cars/bike
router.put("/add-car", auth, addCar);
router.put("/add-bike", auth, addBike);
router.get("/getusercar", auth, getUserCar);
router.get("/getuserbike", auth, getUserBike);


//  ******************************************************************************************************
//                                  Booking Routes
// *******************************************************************************************************

router.put("/deletecar", auth, deleteCar);

router.post("/new-booking", newBooking);


module.exports = router