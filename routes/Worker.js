const express = require("express");
const router = express.Router();


const {

    confirmBooking,
    completeBooking,
    getWorkerConfirmedBooking

} = require("../controllers/Booking")


const { auth, isWorker, authWorker } = require("../middleware/auth")


router.put("/confirm-booking", authWorker, isWorker, confirmBooking);
router.put("/complete-booking", authWorker, isWorker, completeBooking);


router.get("/getconfirmbooking", authWorker, isWorker, getWorkerConfirmedBooking);

module.exports = router 