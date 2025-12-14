const express = require("express");
const { OtpSend, OtpVerify } = require("../controllers/OTP/OtpController")
const router = express.Router();

router.post("/otp/send", OtpSend);
router.post("/otp/verify", OtpVerify);

module.exports = router