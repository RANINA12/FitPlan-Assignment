const express = require("express");
const router = express.Router();
console.log("-----> Trainer Routes Loaded! <-----"); // Add this line

const { newFitnessPlan, EditFitnessPlan, getAllPlans } = require("../controllers/Trainer Operations/Traineroperations")
router.put("/dashboard/update-plan/:id", EditFitnessPlan);
router.post("/create/newPlan", newFitnessPlan);
router.get("/fetch/AllPlans", getAllPlans);
console.log("Is newFitnessPlan a function?", typeof newFitnessPlan);

module.exports = router;
