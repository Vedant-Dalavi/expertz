const express = require('express');
const router = express.Router();
const upload = require('../middleware/fileUpload');


const { newService } = require("../controllers/Service");

router.post("/newService", upload.array('image', 10), newService)


module.exports = router
