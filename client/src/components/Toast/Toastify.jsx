import React from "react";
import "./Toastify.css";

export default function Toast({ message, type }) {
    return (
        <div className={`toast-container ${type}`}>
            {message}
        </div>
    );
}
