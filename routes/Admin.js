const express = require("express");
const router = express.Router();
const { adminSignup, adminLogin } = require("../controllers/Auth");
const { getAllUser, getAllWorker, getAllBooking, createNewService, addVehicleBrand, addBrandCar, addBrandBike } = require("../controllers/Admin");
const upload = require('../middleware/fileUpload');
const { isAdmin } = require("../middleware/auth")


const { auth } = require("../middleware/auth");
const { VehiclesInfo, BrandInfo } = require("../controllers/Vehicles");

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


// ***************************************************************************************************************
//                                             Admin Vihicle Route
// ***************************************************************************************************************

// router.post("/add-newbrand", isAdmin, addVichicleBrand);
router.post("/add-newbrand", addVehicleBrand);

router.get("/getallvehicle", BrandInfo);
router.get("/add-brandcar", addBrandCar);
router.get("/add-brandbike", addBrandBike);


module.exports = router
