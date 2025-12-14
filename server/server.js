const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const OtpRoutes = require("./routes/OtpRoutes")
const connectDB = require("./db/connection");
const TrainerRoute = require("./routes/TrainerRoutes")

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);


connectDB();


// Routes
app.use("/api", userRoutes);
app.use("/api", OtpRoutes);
app.use("/api", TrainerRoute)

const PORT = process.env.PORT || 7000;

app.listen(PORT, () =>
    console.log("Server running on", PORT)
);

