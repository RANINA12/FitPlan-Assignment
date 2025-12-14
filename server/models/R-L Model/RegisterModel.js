const mongoose = require("mongoose")

const RegisterSchema = new mongoose.Schema({
    uuid: {
        type: String,
        unique: true,
        require
    },
    Email: {
        type: String,
        unique: true,
        require
    },
    Role: {
        type: String,
        enum: ["User", "Trainer"],
        require,
    }
});

const Register = mongoose.model("Register", RegisterSchema);
module.exports = Register;


