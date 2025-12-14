const mongoose = require("mongoose")

const LoginSchema = new mongoose.Schema({

    uuid: {
        type: String,
        require,
        unique: true,
    },
    Email: {
        type: String,
        require,
        unique: true,
    },

    Password: {
        type: String,

    },

    Role: {
        type: String,
        enum: ["User", "Trainer"],
        require,
    }

})

const Login = mongoose.model("Login", LoginSchema);
module.exports = Login;