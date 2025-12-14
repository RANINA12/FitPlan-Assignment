import { useEffect, useState } from "react";
import { uploadnewPlans, editExitingPlan, deletePlan, getAllPlans, } from "../../api/auth";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
const initialForm = {
    Title: "",
    Description: "",
    Price: "",
    Duration: "",
};
function TrainerContent() {
    const [plans, setPlans] = useState([]);
    const [formData, setFormData] = useState(initialForm);
    const [editId, setEditId] = useState(null);
    const [error, setError] = useState("");
    const [disabled, setdisabled] = useState(false);
    const { showToast } = useToast();
    const { user } = useAuth();

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await getAllPlans();
                setPlans(res.data.data || res.data);
            } catch {
                setError("Failed to fetch plans");
            }
        };
        fetchPlans();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setdisabled(true);

        try {
            let res;

            if (editId) {
                res = await editExitingPlan(editId, formData);
            } else {
                res = await uploadnewPlans(formData);
            }

            if (res.data?.success) {
                showToast(res.data.msg, "success");
                setFormData(initialForm);
                setEditId(null);

                const updated = await getAllPlans();
                setPlans(updated.data.data || updated.data);
            } else {
                showToast("Operation failed", "error");
            }
        } catch (err) {
            if (err.response) {
                if (err.response.status === 400) {
                    showToast(err.response.data.msg || "Invalid data", "error");
                } else if (err.response.status === 404) {
                    showToast(err.response.data.msg, "error");
                } else {
                    showToast(err.response.data.msg, "error");
                }
            } else {
                showToast(err.response.data.msg, "error");
            }
        } finally {
            setdisabled(false);
        }
    };

    const handleEdit = (plan) => {
        setEditId(plan._id);
        setFormData({
            Title: plan.Title,
            Description: plan.Description,
            Price: plan.Price,
            Duration: plan.Duration,
        });
    };

    const handleDelete = async (id) => {
        try {
            const res = await deletePlan(id);

            if (res.data?.success) {
                showToast(res.data.msg, "success");
                setPlans((prev) => prev.filter((p) => p._id !== id));
            }
        } catch (err) {
            if (err.response?.status === 404) {
                showToast("Plan not found", "error");
            } else {
                showToast("Delete failed", "error");
            }
        }
    };

    return (
        <div className="plan-wrapper">
            <form onSubmit={handleSubmit}>
                <h3>{editId ? "Edit Plan" : "Create Plan"}</h3>
                <input
                    name="Title"
                    placeholder="Title"
                    value={formData.Title}
                    onChange={handleChange}
                />

                <textarea
                    name="Description"
                    placeholder="Description"
                    value={formData.Description}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="Price"
                    placeholder="Price (₹)"
                    value={formData.Price}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="Duration"
                    placeholder="Duration (days)"
                    value={formData.Duration}
                    onChange={handleChange}
                />

                <button disabled={disabled}>
                    {editId ? "Update" : "Create"}
                </button>

                {error && <p className="error">{error}</p>}
            </form>

            <div className="plan-list">
                {plans.map((plan) => (
                    <div key={plan._id} className="plan-card">
                        <h4>{plan.Title}</h4>
                        <p>₹ {plan.Price}</p>
                        <p>{plan.Duration} days</p>

                        <button onClick={() => handleEdit(plan)}>Edit</button>
                        <button onClick={() => handleDelete(plan._id)}> Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TrainerContent;
