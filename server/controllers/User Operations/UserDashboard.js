const Suscription = require("../../models/UserSuscription/Suscription");
const purchased = require("../../models/UserSuscription/PurchasedPlan");
const TrainerPlan = require("../../models/Trainer Model/TrainerPlan")
const { isValidEmail } = require("../../utils/validator");

function sortDataTOSuscribe(data, List) {
    return data.sort((a, b) => {
        const idxA = List.indexOf(a.TrainerEmail);
        const idxB = List.indexOf(b.TrainerEmail);

        if (idxA !== -1 && idxB !== -1) {
            return idxA - idxB;
        }
        if (idxA !== -1) return -1;
        if (idxB !== -1) return -1;
        return 0;

    })
}
const UserDashBoardLoggedUser = async (req, res) => {

    const { Email } = req.query;
    if (!isValidEmail) {
        return res.status(400).json({
            success: false,
            msg: "Invalid request"
        });
    }

    // now fetch trainer  to which the user suscribed  and exclude the purchased flan then follwed by the 

    const SusbribedTrainers = await Suscription.findOne({ Email: Email }, { SuscribedTrainer: 1, Suscribed: 1, _id: 0 });

    if (!SusbribedTrainers) {
        return res.status(500).json({
            success: false,
            msg: "Internal Error"
        });
    }
    try {
        const SusbribedTrainersList = SusbribedTrainers.SuscribedTrainer;
        let suscribe = true;
        let SuscribeList = [];
        if (SusbribedTrainersList.length === 0) {
            suscribe = false;
        } else {
            SuscribeList = SusbribedTrainersList;
        }
        const ContentToDisplay = await TrainerPlan.find({}, { Description: 0 }).lean();
        const AlreadyBuyedPlan = await purchased.find(
            { PurchasedBy: Email },
            { TrainerPlanId: 1, _id: 0 }).lean();

        const AlreadyBuyedPlanList = AlreadyBuyedPlan.map(p => p.TrainerPlanId);
        let SemiFinalList = ContentToDisplay;
        if (suscribe) {
            SemiFinalList = sortDataTOSuscribe(ContentToDisplay, SuscribeList);
        }
        const finalList = SemiFinalList.filter(
            item => !AlreadyBuyedPlanList.includes(item.uuid)
        );
        const finalListWithFollowstatus = finalList.map(item => ({
            ...item,
            isFollowed: SuscribeList.includes(item.TrainerEmail)
        }));
        return res.status(200).json({
            success: true,
            msg: "Success",
            list: finalListWithFollowstatus,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error",
        });
    }
}
const UserDashBoardUnLoggedUser = async (req, res) => {
    const ContentToDisplay = await TrainerPlan.find(
        {},
        { Description: 0 }
    ).lean();
    try {
        res.status(200).json({
            success: true,
            msg: "Fetched Data for unlogged User",
            list: ContentToDisplay
        })
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error",
        });
    }
}

const showSuscriberlist = async (req, res) => {

    const { Email } = req.query;

    if (!isValidEmail) {
        return res.status(400).json({
            success: false,
            msg: "Bad Request"
        })
    }

    const Suscriberlist = await Suscription.find({ Email: Email })

    return res.status(200).json({
        success: true,
        msg: "Suscriber list fetched",
        list: Suscriberlist
    })


}

const showpurchasedplan = async (req, res) => {

    const { Email } = req.query;

    if (!isValidEmail(Email)) {
        return res.status(400).json({
            success: false,
            msg: "Invalid Request"
        })
    }
    try {
        const findAllpurchasedPlan = await purchased.find({ PurchasedBy: Email }, { TrainerPlanId: 1, _id: 0 });

        if (!findAllpurchasedPlan) {
            return res.status(404).json({
                success: false,
                msg: "No Active Plan Found "
            });
        }
        //Array of object we recieved // convert karna pdeg 
        const planId = findAllpurchasedPlan.map(id => id.TrainerPlanId);
        // all planId received  , now with this i want to fecth all details of the Trainerschema 
        const Planlist = await TrainerPlan.find({ uuid: { $in: planId } }).lean();

        return res.status(200).json({
            success: true,
            msg: "ListFecthed",
            list: Planlist
        })
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error"
        })
    }
}

const ShowDescription = async (req, res) => {
    const { uuid } = req.params;
    const { Email } = req.query;

    if (!uuid || !Email) {
        return res.status(400).json({
            success: false,
            msg: "Invalid request"
        });
    }

    try {
        const findvalidity = await purchased.findOne(
            { PurchasedBy: Email, TrainerPlanId: uuid },
            { ValidityUpto: 1, _id: 0 }
        );

        if (!findvalidity) {
            return res.status(400).json({
                success: false,
                msg: "No such Plan"
            });
        }

        if (new Date() > findvalidity.ValidityUpto) {
            return res.status(400).json({
                success: false,
                msg: "Validity Expired"
            });
        }

        const content = await TrainerPlan.findOne({ uuid }).lean();

        return res.status(200).json({
            success: true,
            msg: "Success",
            plan: content
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error"
        });
    }
};

module.exports = {
    UserDashBoardLoggedUser, UserDashBoardUnLoggedUser,
    showSuscriberlist, showpurchasedplan, ShowDescription,
};