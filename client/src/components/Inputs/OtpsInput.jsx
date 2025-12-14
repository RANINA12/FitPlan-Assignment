import React, { forwardRef } from "react";
import "./OtpInput.css";

const OtpInput = forwardRef(({ value, onChange, onKeyDown }, ref) => {
    return (
        <input
            ref={ref}
            type="text"
            inputMode="numeric"
            value={value}
            maxLength={1}
            onChange={onChange}
            onKeyDown={onKeyDown}
            className="otp-box"
        />
    );
});

export default OtpInput;

