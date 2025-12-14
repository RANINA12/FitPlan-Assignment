import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { showSuscriberlist, showpurchasedplan } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import "./UserAction.css";
function UserAction() {
    const { user, role } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [subscribedTrainers, setSubscribedTrainers] = useState([]);
    const [purchasedPlans, setPurchasedPlans] = useState([]);
    useEffect(() => {
        if (!user || role !== "User") return;
        const fetchData = async () => {
            try {
                const [subRes, buyRes] = await Promise.all([showSuscriberlist(user), showpurchasedplan(user),]);

                if (subRes.data?.success) {
                    setSubscribedTrainers(subRes.data.list);
                }
                if (buyRes.data?.success) {
                    setPurchasedPlans(buyRes.data.list);
                }
            } catch (err) {
                showToast(err.response?.data?.msg || "Failed to load data", "error");
            }
        };
        fetchData();
    }, [user, role]);

    const handleSeeDetails = async (uuid) => {
        if (!user) {
            showToast("You need to login first", "error");
            return;
        }

        navigate(`/plan/${uuid}`)

    };


    if (!user || role !== "User") {
        return null;
    }

    return (
        <div className="user-dashboard">
            <section>
                <h2>Subscribed Trainers</h2>
                {subscribedTrainers.length === 0 ? (
                    <p>No subscriptions yet</p>) : (<ul>
                        {subscribedTrainers.map((trainer, index) => (
                            <li key={index}>{trainer.SuscribedTrainer}</li>
                        ))}
                    </ul>
                )}
            </section>
            <section>
                <h2>Purchased Plans</h2>
                {purchasedPlans.length === 0 ? (
                    <p>No plans purchased</p>
                ) : (
                    <div className="plan-cards">
                        {purchasedPlans.map((plan) => (
                            <div key={plan.uuid} className="plan-card">
                                <h3>{plan.Title}</h3>
                                <p>Trainer: {plan.TrainerEmail}</p>
                                <p>Price: ₹ {plan.Price}</p>
                                <button onClick={() => handleSeeDetails(plan.uuid)}> see Details</button>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
export default UserAction;
