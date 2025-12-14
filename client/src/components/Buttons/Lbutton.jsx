import "./Lbutton.css"
function Lbutton({ text, hadleButtonclick, disabled, variant }) {
    return (
        <div className="l-btn-wrapper">
            <button
                onClick={hadleButtonclick}
                disabled={disabled}
                className="l-btn"
            >
                {text}
            </button>
        </div>
    );
}

export default Lbutton 