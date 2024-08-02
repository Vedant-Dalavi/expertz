const express = require("express");
const router = express.Router();
const { adminSignup, adminLogin } = require("../controllers/Auth");
const { getAllUser, getAllWorker, getAllBooking, createNewService } = require("../controllers/Admin");
const upload = require('../middleware/fileUpload');

const { auth } = require("../middleware/auth");

// ***************************************************************************************************************
//                                             Admin Auth Route
// ***************************************************************************************************************

router.post("/admin-signup", adminSignup);
router.post("/admin-login", adminLogin);

// getAll user 
router.get("/getalluser", getAllUser)
// getAllWorker
router.get("/getallworker", getAllWorker)

// getAllBookings
router.get("/getallbookings", getAllBooking)

// router.post('/create-newservice', upload.array('images', 10), createNewService);



module.exports = router
