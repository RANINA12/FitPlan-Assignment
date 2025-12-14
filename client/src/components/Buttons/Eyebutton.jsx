import "./Eyebutton.css"
function Eyebutton({ hadleButtonclick, variant, seen }) {
    return (
        <div className="eye-btn-wrapper">
            <button
                type="button"
                onClick={hadleButtonclick}
                className="eye-btn"
            >
                {seen === "false" ? "Show" : "Hide"}
            </button>
        </div>
    );
}

export default Eyebutton;