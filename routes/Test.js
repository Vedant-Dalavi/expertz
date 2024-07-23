// const express = require('express')
// const router = express.Router()
// const path = require("path");
// const multer = require('multer');
// const fs = require('fs');


// const { uploadImg, loadHomepage } = require("../controllers/Test");


// // const uploadsDir = path.join('uploads');
// const uploadsDir = path.join(__dirname, 'uploads');

// // Ensure uploads directory exists
// if (!fs.existsSync(uploadsDir)) {
//     console.log(`Creating uploads directory at ${uploadsDir}`);
//     fs.mkdirSync(uploadsDir, { recursive: true });
// }

// // Multer storage configuration
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, uploadsDir);
//     },
//     filename: function (req, file, cb) {
//         cb(null, `${file.originalname.split(".")[0]}-${Date.now()}.${file.originalname.split(".")[1]}`);
//     }
// });

// const upload = multer({ storage })


// router.post('/', upload.single('profileImg'), uploadImg);
// router.get('/', loadHomepage);

// module.exports = router;
