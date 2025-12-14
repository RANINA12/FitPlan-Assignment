const express = require("express");
const router = express.Router();

const { newFitnessPlan, EditFitnessPlan } = require("../controllers/Trainer Operations/Traineroperations")
router.put("", EditFitnessPlan);
router.post("", newFitnessPlan);

module.exports = router;