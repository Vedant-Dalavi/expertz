const express = require('express');
const app = express();
const userRoutes = require("./routes/User");
const vehicleRoute = require("./routes/Vehicles");
const bookingRoute = require("./routes/Bookings");
const adminRoute = require("./routes/Admin");
const workerRoute = require("./routes/Worker");
const serviceRoute = require("./routes/Service");
// const testRoute = require("./routes/Test")

const database = require("./config/database");

const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const multer = require('multer');
const fs = require('fs');

const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");

dotenv.config();
const PORT = process.env.PORT || 4000;


app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp"
    })
)

// cloudinary connect
cloudinaryConnect();



// DB connect
database.connect();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded


// {
//     origin: "http://localhost:4000",
//     credentials: true,
// }




// // Set view engine
// app.set("view engine", "ejs");
// app.set("views", path.resolve("./views"));
// home route

app.use(express.static(path.join(__dirname, 'otika-bootstrap-admin-template/assets')));

app.get("/", async (req, res) => {
    res.send("default Route");
})

// Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/vehicles", vehicleRoute);
app.use("/api/v1/bookings", bookingRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/worker", workerRoute);
app.use("/api/v1/service", serviceRoute);

// test route
// app.use("/test", testRoute);

app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`);
});

