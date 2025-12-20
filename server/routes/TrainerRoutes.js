const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/Verify")
const { newFitnessPlan, EditFitnessPlan, getAllPlans, DeletePlan } = require("../controllers/Trainer Operations/Traineroperations")
router.put("/dashboard/update-plan/:id", verifyToken, EditFitnessPlan);
router.post("/create/newPlan", verifyToken, newFitnessPlan);
router.get("/fetch/AllPlans", verifyToken, getAllPlans);
router.delete("/delete/plan/:uuid", verifyToken, DeletePlan)

module.exports = router;
