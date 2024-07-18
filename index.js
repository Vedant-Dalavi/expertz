const express = require('express');
const app = express();

const userRoutes = require("./routes/User");

const vehicleRoute = require("./routes/Vehicles");
const bookingRoute = require("./routes/Bookings");


const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
// const { cloudinaryConnect } = require("./config/cloudinary");
// const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 4000;

// DB connect
database.connect();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
)

// app.use(
//     fileUpload({
//         useTempFiles: true,
//         tempFileDir: "/tmp"
//     })
// )

// cloudinary connect
// cloudinaryConnect();
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/vehicles", vehicleRoute);
app.use("/api/v1/bookings", bookingRoute);


// /default

// app.get("/", (req, res) => {
//     return res.json()({
//         success: true,
//         message: "Your server is up and running....."
//     })
// })

// ***********************************************************************************************
const path = require("path")
const multer = require('multer')
const upload = multer({ dest: 'http://expertz.softtronix.co.in/assests/profileImages/' })

app.set("view engine", "ejs")
app.set("views", path.resolve("./views"))

app.get("/", (req, res) => {
    return res.render("homepage")
})

app.post('/upload', upload.single('profileImg'), function (req, res) {
    console.log(req.body)
    console.log(req.file)

})

// ***********************************************************************************************

app.listen(PORT, () => {
    console.log(`app is running at ${PORT}`);
})