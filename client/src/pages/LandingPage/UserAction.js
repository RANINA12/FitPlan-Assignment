import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { showSuscriberlist, showpurchasedplan } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import "./UserAction";
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
                const [subRes, buyRes] = await Promise.all([showSuscriberlist(), showpurchasedplan(),]);

                if (subRes.data?.success) {
                    setSubscribedTrainers(subRes.data.data);
                }
                if (buyRes.data?.success) {
                    setPurchasedPlans(buyRes.data.data);
                }
            } catch (err) {
                showToast(err.response?.data?.msg || "Failed to load data", "error");
            }
        };
        fetchData();
    }, [user, role]);

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
                            <li key={index}>{trainer}</li>
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
                                <p>Valid Till: {new Date(plan.ValidityUpto).toDateString()}</p>
                                <button onClick={() => navigate(`/plan/${plan.uuid}`, {
                                    state: { plan }
                                })}> see Details</button>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
export default UserAction;
