const mongoose = require('mongoose');
const OTPSchema = new mongoose.Schema({
    Email: {
        type: String,
        unique: true,
        require
    },
    OTP: {
        type: String,
        require
    },

    ExpiresAt: {
        type: String,
        require
    }

})

const OTP = mongoose.model("OTP", OTPSchema);
module.exports = OTP