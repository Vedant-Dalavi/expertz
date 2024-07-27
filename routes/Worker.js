const express = require("express");
const router = express.Router();


const {

    confirmBooking

} = require("../controllers/Booking")


const { auth, isWorker, authWorker } = require("../middleware/auth")


router.put("/confirm-booking", authWorker, isWorker, confirmBooking);

module.exports = router 