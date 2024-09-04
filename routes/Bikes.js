// Import the required modules
const express = require("express")
const router = express.Router()

// Import the required controllers and middleware functions
const {
    BikeInfo,
    addBike
} = require("../controllers/Bikes")


const { auth } = require("../middleware/auth")


// ********************************************************************************************************
//                                      Bike routes
// ********************************************************************************************************

// get all bike
router.get("/get-bikes", BikeInfo);

// insert a bike in user's bike

router.put("bike/addbike", addBike);
router.put("bike/deletebike", deleteBike);


module.exports = router