import { useState, useEffect } from "react";
function useOtpTimer(initialTime = 30) {
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (timeLeft === 0) {
            setCanResend(true);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((t) => t - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const resetTimer = () => {
        setTimeLeft(initialTime);
        setCanResend(false);
    };

    return {
        timeLeft,
        canResend,
        resetTimer,
    };
}

export default useOtpTimer;
