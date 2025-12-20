const jwt = require("jsonwebtoken");
const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            msg: "No Access Token found"
        });
    }

    const token = authHeader.replace("Bearer ", "").trim();

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decode;
        next();
    }
    catch (error) {
        console.error("error", error)
        return res.status(401).json({
            msg: "Invalid Token provided"
        })
    }
}

module.exports = { verifyToken }