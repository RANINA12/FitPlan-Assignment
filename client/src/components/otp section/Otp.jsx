import { useRef, useState } from "react";
import useOtpTimer from "../../hooks/useOtptimer";
import OtpInput from "../Inputs/OtpsInput";
import Lbutton from "../Buttons/Lbutton";
import "./Otp.css"
function Otp({ length = 6, isActive, onComplete, onResend }) {
    const [otp, setOtp] = useState(Array(length).fill(""));
    const inputRefs = useRef([]);
    const { timeLeft, canResend, resetTimer } = useOtpTimer(30);
    if (!isActive) return null
    const handleChange = (value, index) => {
        if (!/^[0-9]?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value !== "" && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
        if (newOtp.every((digit) => digit !== "")) {
            onComplete(newOtp.join(""));
        }
    };
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleResendOtp = () => {
        onResend();
        resetTimer();
        setOtp(Array(length).fill(""))
    };
    return (
        <div className="otp-container">

            <div className="otp-inputs">
                {otp.map((digit, index) => (
                    <OtpInput
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleChange(e.target.value, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}

                    />
                ))}
            </div>
            <div className="otp-timer">
                {!canResend
                    ? `Resend OTP in ${timeLeft}s`
                    : (
                        <Lbutton
                            text="Resend OTP"
                            variant="Primary"
                            disabled={false}
                            hadleButtonclick={handleResendOtp}
                        />
                    )
                }
            </div>

        </div>
    );
}

export default Otp;
