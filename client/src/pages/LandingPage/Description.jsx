import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showDescription } from "../../api/auth";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import "./Description.css"
function Description() {
    const { uuid } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { user, role } = useAuth();
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlan = async () => {
            if (!user) {
                showToast("You need to login first", "error");
                return;
            }

            try {
                const res = await showDescription(user, uuid);

                if (res.data?.success) {
                    setPlan(res.data.plan);
                } else {
                    showToast(res.data?.msg || "Failed to fetch details", "error");
                }
            } catch (err) {
                showToast(
                    err.response?.data?.msg || "Something went wrong",
                    "error"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchPlan();
    }, [uuid]);

    if (loading) {
        return <p>Loading plan details...</p>;
    }

    if (!plan) {
        return (
            <div>
                <p>Data not available</p>
                <button onClick={() => navigate(-1)}>Go Back</button>
            </div>
        );
    }

    return (
        <div className="plan-details-page">
            <button onClick={() => navigate(-1)}>⬅ Back</button>

            <h1>{plan.Title}</h1>

            <p><b>Trainer:</b> {plan.TrainerEmail}</p>
            <p><b>Price:</b> ₹ {plan.Price}</p>
            <p><b>Duration:</b> {plan.Duration} days</p>

            <h3>Description</h3>
            <p>{plan.Description}</p>
        </div>
    );
}

export default Description;
