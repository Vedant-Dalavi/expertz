const express = require("express");
const router = express.Router();


const {

    confirmBooking,
    completeBooking,
    getWorkerConfirmedBooking,
    getWorkerCompletedBooking

} = require("../controllers/Booking")


const { auth, isWorker, authWorker } = require("../middleware/auth")


router.put("/confirm-booking", authWorker, isWorker, confirmBooking);
router.put("/complete-booking", authWorker, isWorker, completeBooking);


router.post("/getconfirmbooking", authWorker, isWorker, getWorkerConfirmedBooking);
router.get("/getcompletebooking", authWorker, isWorker, getWorkerCompletedBooking);

module.exports = router 