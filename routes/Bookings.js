// Import the required modules
const express = require("express")
const router = express.Router()

// Import the required controllers and middleware functions
const {
    newBooking,
    getUserBooking,
    updateBooking,
    cancelBooking,
    getAllBooking
} = require("../controllers/Booking")



const { auth } = require("../middleware/auth")

// Routes for Login, Signup, and Authentication


// *******************************************************************************************************
//                                  Booking Routes
// *******************************************************************************************************


router.post("/new-booking", auth, newBooking);
router.get("/user-booking", auth, getUserBooking);
router.put("/update-booking", auth, updateBooking);
router.delete("/delete-booking", auth, cancelBooking);
router.get("/", getAllBooking);


module.exports = router