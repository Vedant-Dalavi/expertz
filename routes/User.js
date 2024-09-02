const express = require("express");
const { addBike, deleteBike } = require("../controllers/Bikes");
const router = express.Router();


const { auth } = require("../middleware/auth");
const { addCar, deleteCar } = require("../controllers/Cars");
const { updateUser } = require("../controllers/User");


router.put("/update-user",auth,updateUser)

router.put("/cars/addcar", auth, addCar);
router.delete("/cars/deletecar", auth, deleteCar);


router.put("/bike/addbike", auth, addBike);
router.put("/bike/deletebike", auth, deleteBike);


module.exports = router


