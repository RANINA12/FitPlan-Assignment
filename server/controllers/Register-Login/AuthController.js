const Register = require("../../models/R-L Model/RegisterModel");
const Login = require("../../models/R-L Model/LoginModel");
const { isValidEmail } = require("../../utils/validator");
const { OtpSend } = require("../OTP/OtpController");
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const SuscriptionList = require("../../models/UserSuscription/Suscription");
function generateRefreshToken(id) {
    return jwt.sign(
        { id },
        process.env.REFRESH_SECRET,
        { expiresIn: "7d" }
    );
}

function generateAccessToken(id) {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        {
            expiresIn: "30m",
            issuer: "XYZ-App",
            audience: "users",
            jwtid: uuidv4(),
        }
    );
}

const LoginController = async (req, res) => {
    const { Email, Password } = req.body;

    if (!Email || !Password || (!isValidEmail(Email))) {
        return res.status(400).json({
            success: false,
            msg: "Invaild Request"
        });
    }
    try {
        const finduser = await Login.findOne({ Email: Email });
        let isMatch = false;
        if (finduser) {
            isMatch = await bcrypt.compare(Password, finduser.Password)
        };
        if (!finduser || !isMatch) return res.status(200).json({
            success: false,
            msg: "Invalid Credentials"
        });

        const accessToken = generateAccessToken(finduser.uuid);
        const refreshToken = generateRefreshToken(finduser.uuid);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.status(200).json({
            success: true,
            msg: "Login Successfull",
            accessToken,
            User: Email,
            Role: finduser.Role,
        });

    }
    catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            msg: "Server Error"
        })
    }
}
const RegisterController = async (req, res) => {
    const { Email, Password, ConfirmPassword, Role } = req.body;
    if (!Email || !Password || !ConfirmPassword || !Role || (!isValidEmail(Email))) return res.status(400).json({
        success: false,
        msg: "Some field are missing"
    })
    if (Password !== ConfirmPassword) return res.status(200).json({
        success: false,
        msg: "Password Not Matching"
    });
    try {
        const finduser = await Register.findOne({ Email: Email });
        if (finduser) return res.status(200).json({
            success: false,
            msg: "This Email already Register"
        })
        const unique_id = uuidv4();
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);

        const newRegister = new Register({
            uuid: unique_id,
            Email: Email,
            Role: Role,

        })
        const newLogin = new Login({
            uuid: unique_id,
            Email: Email,
            Password: hashedPassword,
            Role: Role,
        });

        const newSuscription = new SuscriptionList({
            uuid: unique_id,
            Email: Email,
            SuscribedTrainer: []
        })
        await newSuscription.save();
        await newRegister.save();
        await newLogin.save();

        const accessToken = generateAccessToken(unique_id);
        const refreshToken = generateRefreshToken(unique_id);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.status(200).json({
            success: true,
            msg: "Registration SucessFull",
            accessToken,
            User: Email,
            Role: Role
        })
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error"
        })
    }
}
const GoogleSignUpIN = async (req, res) => {
    console.error("Api hit ");
    const { Email } = req.body;
    console.error(Email);
    if (!Email) return res.status(400).json({
        success: false,
        msg: "Fail 3rd Party Sign in"
    });

    const unique_id = uuidv4();

    try {
        const finduser = await Register.findOne({ Email: Email });
        if (!finduser) {
            const newRegister = new Register({
                uuid: unique_id,
                Email: Email,

            });

            await newRegister.save();
        }
        const accessToken = generateAccessToken(unique_id);
        const refreshToken = generateRefreshToken(unique_id);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            msg: "Successful",
            accessToken,
            User: Email
        })

    }

    catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            msg: "Internal Server Error"
        })
    }
}

const RefreshTokenController = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({
            success: false,
            msg: "Refresh Token Missing"
        });
    }
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
        const newAccessToken = generateAccessToken(decoded.id);
        return res.status(200).json({
            success: true,
            accessToken: newAccessToken
        });

    } catch (error) {
        return res.status(403).json({
            success: false,
            msg: "Invalid or Expired Refresh Token"
        });
    }
};

const PasswordRecovery = async (req, res) => {
    const { Email } = req.body;

    if (!isValidEmail(Email)) {
        return res.status(400).json({
            success: false,
            msg: "Invalid Email"
        });
    }

    try {
        const finduser = await Login.findOne({ Email });

        if (!finduser) {
            return res.status(404).json({
                success: false,
                msg: "Mail ID not registered"
            });
        }

        return OtpSend(req, res);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error"
        });
    }
};

const ResetPassword = async (req, res) => {
    const { Email, NewPassword } = req.body;

    if (!Email || !NewPassword) return res.status(400).json({
        success: false,
        msg: "Invalid Request"
    });
    try {
        const finduser = await Login.findOne({ Email: Email })
        // alredy check in the time of password Recovery email  , but still good to add
        if (!finduser) return res.status(404).json({
            success: false,
            msg: "User Not Found"
        });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(NewPassword, salt);
        await Login.updateOne({ Email }, { Password: hashedPassword });
        return res.status(200).json({
            success: true,
            msg: "Password Update successfully"
        })
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Internal server error"
        })
    }
}
module.exports = {
    LoginController,
    RegisterController,
    RefreshTokenController,
    GoogleSignUpIN,
    PasswordRecovery,
    ResetPassword,
}