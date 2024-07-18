// const multer = require('multer')

// exports.uploadImg = upload.single('profileImg'), (req, res) => {
//     try {

//         console.log(req.body);
//         console.log(req.file);

//         // const { file } = req.files

//         // const storage = multer.diskStorage({
//         //     destination: function (req, file, cb) {
//         //         file = req.files.file
//         //         cb(null, 'http://expertz.softtronix.co.in/assests/profileImages/')
//         //     },
//         //     filename: function (req, file, cb) {
//         //         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//         //         cb(null, file.originalname + '-' + uniqueSuffix)
//         //     }
//         // })

//         // const upload = multer({ storage })
//         // upload();

//     } catch (error) {

//         return res.status(500).json({
//             success: false,
//             message: `Error in uploading image: ${error}`
//         })

//     }
// }

