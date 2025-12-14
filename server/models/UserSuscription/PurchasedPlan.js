const mongoose = require("mongoose");

const purchasedSchema = new mongoose.Schema({

    uuid: {
        type: String,
        unique: true,
        require,
    },

    PurchasedBy: {
        type: String,
        require,
    },

    TrainerPlanId: {
        type: String,
        require,
    },

    ValidityUpto: {
        type: Date,
        require,
    },

})

const purchased = mongoose.model("purchased", purchasedSchema);
module.exports = purchased