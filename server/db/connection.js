const mongoose = require("mongoose");
require("dotenv").config();
mongoose.set("strictQuery", false);
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
        });
        console.log("Database connected");
    } catch (err) {
        console.error("Error in database connection: " + err);
        process.exit(1);
    }
};
module.exports = connectDB;
