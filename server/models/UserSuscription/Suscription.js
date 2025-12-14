const mongoose = require("mongoose");

const SuscriptionSchema = new mongoose.Schema({
    uuid: {
        type: String,
        unique: true,
    },
    Email: {  // user Email
        type: String,
        unique: true,
        require,
    },
    SuscribedTrainer: {
        type: [String],
    },
})

const SuscriptionList = mongoose.model("SuscriptionList", SuscriptionSchema);
module.exports = SuscriptionList;