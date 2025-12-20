const { v4: uuidv4 } = require("uuid");
const { isValidEmail } = require("../../utils/validator");
const TrainerPlan = require("../../models/Trainer Model/TrainerPlan")
const newFitnessPlan = async (req, res) => {
    console.log("Api hit")
    const { Email, Title, Description, Price, Duration } = req.body;
    console.log("REQ BODY:", req.body);

    if (!isValidEmail(Email) || !Title || !Description || !Price || !Duration) {
        return res.status(400).json({
            success: false,
            msg: "All fields are required"
        });
    }

    try {
        const unique_id = uuidv4();

        const newPlan = new TrainerPlan({
            uuid: unique_id,
            TrainerEmail: Email,
            Title,
            Description,
            Price,
            Duration
        });

        await newPlan.save();

        return res.status(200).json({
            success: true,
            msg: "Plan created successfully",
            plan: newPlan
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error"
        });
    }
};

const EditFitnessPlan = async (req, res) => {
    const { id } = req.params;
    const { Title, Description, Price, Duration } = req.body;

    console.log("ID FROM PARAM:", id);
    console.log("BODY:", req.body);

    if (!id || !Title || !Description || !Price || !Duration) {
        return res.status(400).json({
            success: false,
            msg: "All fields are required"
        });
    }

    try {
        const updated = await TrainerPlan.findByIdAndUpdate(
            id,
            {
                Title,
                Description,
                Price: Number(Price),
                Duration
            },
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({
                success: false,
                msg: "Plan not found"
            });
        }

        return res.status(200).json({
            success: true,
            msg: "Plan edited successfully",
            plan: updated
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error"
        });
    }
};

const getAllPlans = async (req, res) => {
    try {
        const { Email } = req.query;

        let plans;
        if (Email) {
            plans = await TrainerPlan.find({ TrainerEmail: Email }).lean();
        } else {
            plans = await TrainerPlan.find({}).lean();
        }

        return res.status(200).json({
            success: true,
            msg: "Plans fetched successfully",
            list: plans
        });

    } catch (error) {
        console.error("getAllPlans error:", error);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error"
        });
    }
};

const DeletePlan = async (req, res) => {
    console.log("api hit");
    const uuid = req.params.uuid;
    console.log("uuid got", uuid);
    try {
        const d = await TrainerPlan.findOneAndDelete({ uuid: uuid })

        if (!d) {
            return res.status(404).json({
                success: false,
                msg: "That is not found"
            })
        }
        else {
            return res.status(200).json({
                success: true,
                msg: "Successfully  deleted "
            })
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Internal  Server Error"
        })
    }


}

module.exports = { newFitnessPlan, EditFitnessPlan, getAllPlans, DeletePlan };