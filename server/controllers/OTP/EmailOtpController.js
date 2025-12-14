const nodemailer = require("nodemailer");
require("dotenv").config();

async function OtpMail(Email, Otp) {
    try {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.NODE_MAILER_USER,
                pass: process.env.NODE_MAILER_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        let mailOptions = {
            from: process.env.NODE_MAILER_USER,
            to: Email,
            subject: "One Time Password",
            html: `Your otp ${Otp}. Do not share with others.`,
        };

        await transporter.sendMail(mailOptions);

        console.log("Otp Email sent successfully");
        return true;
    }
    catch (err) {
        console.log("Mail sending error: ", err);
        return false;
    }
}

module.exports = { OtpMail };
