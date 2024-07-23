const express = require('express');
const app = express();
const userRoutes = require("./routes/User");
const vehicleRoute = require("./routes/Vehicles");
const bookingRoute = require("./routes/Bookings");
const adminRoute = require("./routes/Admin");
// const testRoute = require("./routes/Test")

const database = require("./config/database");

const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const multer = require('multer');
const fs = require('fs');

dotenv.config();
const PORT = process.env.PORT || 4000;



// DB connect
database.connect();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:4000",
        credentials: true,
    })
);




// // Set view engine
// app.set("view engine", "ejs");
// app.set("views", path.resolve("./views"));

// home route

app.get("/", async (req, res) => {
    res.send("default Route");
})

// Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/vehicles", vehicleRoute);
app.use("/api/v1/bookings", bookingRoute);
app.use("/api/v1/admin", adminRoute);

// test route
// app.use("/test", testRoute);

app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`);
});

