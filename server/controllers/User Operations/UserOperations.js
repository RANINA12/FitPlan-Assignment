const { v4: uuidv4 } = require("uuid");
const Suscription = require("../../models/UserSuscription/Suscription");
const TrainerPlan = require("../../models/Trainer Model/TrainerPlan");
const purchased = require("../../models/UserSuscription/PurchasedPlan");
const { isValidEmail } = require("../../utils/validator");
const Suscribe = async (req, res) => {
    const { EmailTrainer, EmailUser } = req.body;

    if (!isValidEmail(EmailTrainer) || !isValidEmail(EmailUser)) {
        return res.status(400).json({
            success: false,
            msg: "Invalid operation"
        });
    }

    try {
        const updated = await Suscription.findOneAndUpdate(
            { Email: EmailUser },
            { $addToSet: { SuscribedTrainer: EmailTrainer } },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            msg: "Subscribed Successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error"
        });
    }
};

const Unsubscribe = async (req, res) => {
    const { EmailTrainer, EmailUser } = req.body;

    if (!isValidEmail(EmailTrainer) || !isValidEmail(EmailUser)) {
        return res.status(400).json({
            success: false,
            msg: "Invalid operation"
        });
    }
    try {
        await Suscription.findOneAndUpdate(
            { Email: EmailUser },
            { $pull: { SuscribedTrainer: EmailTrainer } },
            { new: true }
        );
        return res.status(200).json({
            success: true,
            msg: "Unsubscribed Successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error"
        });
    }
};

const buyPlan = async (req, res) => {
    const { validationcode, Email, TrainerPlanId } = req.body;

    if (validationcode !== "123456") {
        return res.status(400).json({
            success: false,
            msg: "Payment Failed"
        });
    }

    if (!isValidEmail(Email) || !TrainerPlanId) {
        return res.status(400).json({
            success: false,
            msg: "Bad Request"
        });
    }
    try {
        // fetch validity of that plan 
        const findvalidity = await TrainerPlan.findOne({ uuid: TrainerPlanId }, { Duration: 1, _id: 0 })
        if (!findvalidity) {
            return res.status(400).json({
                success: false,
                msg: "No such Plan"
            });
        }
        const today = new Date();
        const validityUpto = new Date(today);
        validityUpto.setDate(today.getDate() + findvalidity.Duration);
        // Abb kya karna hai nikunj ?? create new suscribe paln 
        const unique_id = uuidv4();
        const newPurchase = new purchased({
            uuid: unique_id,
            PurchasedBy: Email,
            TrainerPlanId: TrainerPlanId,
            ValidityUpto: validityUpto,
        })
        await newPurchase.save();

        return res.status(200).json({
            success: true,
            msg: "Plan bought successfully , to access , go to Boughplanned section"
        });
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error"
        })
    }
};


module.exports = { Suscribe, Unsubscribe, buyPlan };


