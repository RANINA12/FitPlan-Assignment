import React from "react";
import "./Inputs.css";
function Input({
    label,
    type = "text",
    value,
    onChange,
    placeholder,
    error,
    disabled = false
}) {
    return (
        <div className="input-wrapper">
            {label && <label className="input-label">{label}</label>}

            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled ? true : undefined}
                className={`input-box ${error ? "input-error" : ""}`}
            />

            {error && <p className="error-text">{error}</p>}
        </div>
    );
}

export default Input


