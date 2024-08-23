const express = require('express');
const router = express.Router();
const upload = require('../middleware/fileUpload');

const checkApiKey = require('../middleware/checkApiKey');


const { newService } = require("../controllers/Service");

router.post("/newService",checkApiKey, upload.array('image', 10), newService)


module.exports = router
