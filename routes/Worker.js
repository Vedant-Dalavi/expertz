const express = require("express");
const router = express.Router();


const {

    confirmBooking,
    completeBooking

} = require("../controllers/Booking")


const { auth, isWorker, authWorker } = require("../middleware/auth")


router.put("/confirm-booking", authWorker, isWorker, confirmBooking);
router.put("/complete-booking", authWorker, isWorker, completeBooking);

module.exports = router 