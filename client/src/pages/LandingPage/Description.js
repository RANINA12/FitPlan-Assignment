import { useLocation, useNavigate } from "react-router-dom";
function Description() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const plan = state?.plan;
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
