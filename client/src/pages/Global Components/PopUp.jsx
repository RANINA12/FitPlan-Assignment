import { useState } from "react";
import { buyProduct } from "../../api/auth";
import { useToast } from "../../context/ToastContext";
import "./PopUp.css";
function BuyPopup({ plan, user, onClose }) {
    const [otp, setOtp] = useState("");
    const [disabled, setDisabled] = useState(false);
    const { showToast } = useToast();

    const handleBuy = async () => {
        setDisabled(true);
        try {
            const res = await buyProduct(validateoncode, user, plan.uuid);

            if (res.data?.success) {
                showToast(res.data.msg, "success");
                onClose();
            }
        } catch (err) {
            showToast(
                err.response?.data?.msg || "Payment failed",
                "error"
            );
        } finally {
            setDisabled(false);
        }
    };

    return (
        <div className="popup-backdrop">
            <div className="popup">
                <h3>{plan.Title}</h3>
                <p>Price: ₹ {plan.Price}</p>

                <input
                    type="text"
                    placeholder="Enter OTP use 123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                />

                <button disabled={disabled} onClick={handleBuy}>
                    Pay
                </button>

                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
}

export default BuyPopup;
