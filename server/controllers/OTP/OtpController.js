const OTP = require("../../models/OTP Model/OtpModel");
const bcrypt = require("bcryptjs");
const otpGenerator = require("otp-generator");
const { isValidEmail } = require("../../utils/validator");
const { OtpMail } = require("./EmailOtpController");
const OtpSend = async (req, res) => {
    const { Email } = req.body;
    if (!isValidEmail(Email)) {
        return res.status(400).json({ success: false, msg: "Invalid Email" });
    }
    try {
        const otp = otpGenerator.generate(6, {
            digits: true,
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(otp, salt);
        const existing = await OTP.findOne({ Email });
        if (!existing) {
            await OTP.create({
                Email,
                OTP: hashedOtp,
                ExpiresAt: Date.now() + 5 * 60 * 1000,
            });
        } else {
            await OTP.updateOne({ Email }, { OTP: hashedOtp, ExpiresAt: Date.now() + 5 * 60 * 1000 });
        }
        const mailSent = await OtpMail(Email, otp);
        if (!mailSent) {
            return res.status(500).json({
                success: false,
                msg: "Could not send OTP. Try again.",
            });
        }
        return res.status(200).json({
            success: true,
            msg: "OTP sent to your email",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Internal server error",
        });
    }
};

const OtpVerify = async (req, res) => {
    const { Email, Otp } = req.body;

    if (!Email || !Otp)
        return res.status(400).json({
            success: false,
            msg: "Email and OTP required",
        });

    try {
        const record = await OTP.findOne({ Email });
        if (!record)
            return res.status(404).json({ success: false, msg: "No OTP found" });

        const isExpired = record.ExpiresAt < Date.now();
        if (isExpired)
            return res.status(400).json({
                success: false,
                msg: "OTP expired",
            });

        const isMatch = await bcrypt.compare(Otp, record.OTP);
        if (!isMatch)
            return res.status(400).json({ success: false, msg: "Invalid OTP" });
        await OTP.deleteOne({ Email });
        return res.status(200).json({ success: true, msg: "OTP verified" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            msg: "Internal server error",
        });
    }
};

module.exports = { OtpSend, OtpVerify };
