const mongoose = require("mongoose");

const TrainerSchema = new mongoose.Schema({
    uuid: {
        type: String,
        require: true,
        unique: true,
    },

    TrainerEmail: {
        type: String,
        require: true
    },

    Title: {
        type: String,
        require: true,
    },

    Description: {
        type: String,
        require: true
    },

    Price: {
        type: Number,
        require: true
    },
    Duration: {
        type: Number,
        required: true
    }
})

const TrainerPlan = mongoose.model("TrainerPlan", TrainerSchema);
module.exports = TrainerPlan;