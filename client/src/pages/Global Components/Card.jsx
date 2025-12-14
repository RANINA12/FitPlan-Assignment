import { useEffect, useState } from "react";
import BuyPopup from "./Popup";
import { unFollowRequest, FollowRequest } from "../../api/auth";
import { useToast } from "../../context/ToastContext";
import "./Card.css"
function Card({ data = [], user }) {
    const { showToast } = useToast();
    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    useEffect(() => {
        setPlans(data);
    }, [data]);

    const handleFollow = async (TrainerEmail, isFollowed) => {
        if (!user) {
            showToast("You need to login first", "error");
            return;
        }

        try {
            const res = isFollowed
                ? await unFollowRequest(user, TrainerEmail)
                : await FollowRequest(user, TrainerEmail);

            if (res.data?.success) {
                showToast(res.data.msg, "success");

                setPlans((prev) =>
                    prev.map((item) =>
                        item.TrainerEmail === TrainerEmail
                            ? { ...item, isFollowed: !isFollowed }
                            : item
                    )
                );
            }
        } catch (err) {
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
                {Array.isArray(plans) && plans.length > 0 ? (
                    plans.map((item) => (
                        <div key={item.uuid} className="card">
                            <h3>{item.Title}</h3>
                            <p>{item.TrainerEmail}</p>
                            <p>₹ {item.Price}</p>
                            <p>{item.Duration} days</p>

                            {/* Follow / Unfollow */}
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

                            {/* Buy Plan */}
                            <button onClick={() => handleBuy(item)}>
                                Buy Plan
                            </button>
                        </div>
                    ))
                ) : (
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
