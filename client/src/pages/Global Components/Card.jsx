import { useEffect, useState } from "react";
import BuyPopup from "./Popup";
import { unFollowRequest, FollowRequest } from "../../api/auth";
import { useToast } from "../../context/ToastContext";
import "./Card.css";
function Card({ data = [], user }) {
    const { showToast } = useToast();
    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    useEffect(() => {
        if (Array.isArray(data)) {
            setPlans((prev) => {
                if (prev.length === 0) return data;
                return data.map((item) => {
                    const local = prev.find(
                        (p) => p.TrainerEmail === item.TrainerEmail
                    );
                    return local ? { ...item, isFollowed: local.isFollowed } : item;
                });
            });
        }
    }, [data]);
    const handleFollow = async (TrainerEmail, isFollowed) => {
        if (!user) {
            showToast("You need to login first", "error");
            return;
        }
        setPlans((prev) => prev.map((item) => item.TrainerEmail === TrainerEmail ? { ...item, isFollowed: !isFollowed } : item));
        try {
            const res = isFollowed ? await unFollowRequest(user, TrainerEmail) : await FollowRequest(user, TrainerEmail);

            if (res.data?.success) {
                showToast(res.data.msg, "success");
            } else {
                throw new Error("Action failed");
            }
        } catch (err) {
            setPlans((prev) => prev.map((item) => item.TrainerEmail === TrainerEmail ? { ...item, isFollowed } : item));
            showToast(err.response?.data?.msg || "Action failed", "error");
        }
    };

    const handleBuy = (plan) => {
        if (!user) {
            showToast("You need to login first", "error");
            return;
        }
        setSelectedPlan(plan);
    };

    return (
        <>
            <div className="cards-wrapper">
                {plans.length > 0 ? (
                    plans.map((item) => (
                        <div key={item.uuid} className="card">
                            <h3>{item.Title}</h3>
                            <p>{item.TrainerEmail}</p>
                            <p>₹ {item.Price}</p>
                            <p>{item.Duration} days</p>

                            {user && (
                                <button
                                    onClick={() =>
                                        handleFollow(
                                            item.TrainerEmail,
                                            item.isFollowed
                                        )
                                    }
                                >
                                    {item.isFollowed ? "Unfollow" : "Follow"}
                                </button>
                            )}

                            <button onClick={() => handleBuy(item)}> Buy Plan  </button>
                        </div>))) : (
                    <p>No plans available</p>
                )}
            </div>
            {selectedPlan && user && (
                <BuyPopup
                    plan={selectedPlan}
                    user={user}
                    onClose={() => setSelectedPlan(null)}
                />
            )}
        </>
    );
}

export default Card;
