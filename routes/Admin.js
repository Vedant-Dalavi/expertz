const express = require("express");
const router = express.Router();
const { adminSignup, adminLogin } = require("../controllers/Auth");
const {
    getAllUser,
    getAllWorker,
    getAllBooking
} = require("../controllers/Admin");

const {
    addCarToService,
    addBikeToService,
    createNewCarService,
    createNewBikeService,
    getAllCarServices,
    getAllBikeServices,
    updateCarService,
    updateModelPrice,
    deleteModel,
} = require("../controllers/Admin/AdminService");

const {
    addVehicleBrand,
    addBrandCar,
    addBrandBike,
    getAllBrand
} = require("../controllers/Admin/AdminVehicle")


const upload = require("../middleware/fileUpload");
const { isAdmin } = require("../middleware/auth");

const { auth } = require("../middleware/auth");
const { VehiclesInfo, BrandInfo } = require("../controllers/Vehicles");
const { getAreaWisePendingBooking } = require("../controllers/Booking");

// ***************************************************************************************************************
//                                             Admin Auth Route
// ***************************************************************************************************************

router.post("/admin-signup", adminSignup);
router.post("/admin-login", adminLogin);

// getAll user
router.get("/getalluser", getAllUser);
// getAllWorker
router.get("/getallworker", getAllWorker);

// getAllBookings
router.get("/getallbookings", getAreaWisePendingBooking);

// router.post('/create-newservice', upload.array('images', 10), createNewService);

// ***************************************************************************************************************
//                                             Admin Vihicle Route
// ***************************************************************************************************************

// router.post("/add-newbrand", isAdmin, addVichicleBrand);
router.post("/add-newbrand", addVehicleBrand);
router.get("/getallbrand", getAllBrand);

router.get("/getallvehicle", BrandInfo);
router.post("/add-brandcar", addBrandCar);
router.post("/add-brandbike", addBrandBike);

// ***************************************************************************************************************
//                                             Admin new service Route
// ***************************************************************************************************************

router.post("/create-carservice", createNewCarService);
router.post("/create-bikeservice", createNewBikeService);

router.get("/get-carservice", getAllCarServices);
router.get("/get-bikeservice", getAllBikeServices);

router.put("/add-carmodel", addCarToService);
router.put("/add-bikemodel", addBikeToService);

// ***************************************************************************************************************
//                                             Admin update service 
// ***************************************************************************************************************


router.put("/update-service", updateCarService);
router.put("/update-modelprice", updateModelPrice);
router.put("/delete-model", deleteModel);


module.exports = router;
