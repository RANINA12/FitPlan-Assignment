import Input from "../../components/Inputs/Inputs"
import { validateEmail } from "../../Utils/validator"
import Lbutton from "../../components/Buttons/Lbutton"
import Otp from "../../components/otp section/otp"
import Eyebutton from "../../components/Buttons/Eyebutton"
import { useState, useEffect } from "react"
import "./Register.css"
import { GoogleLogin } from '@react-oauth/google';
import { registerApi, otpSendApi, verifyOtpApi, GoogleSignUpApi } from '../../api/auth';
import { useToast } from "../../context/ToastContext";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../context/AuthContext";
function Register() {
    const [role, setRole] = useState("");
    const [Otpbutton, setOtpbutton] = useState(true);
    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("");
    const [ConfirmPassword, setConfirmPassword] = useState("");
    const [Emailerror, setEmailError] = useState("");
    const [ConfirmPasswordError, setConfirmPasswordError] = useState("")
    const [VerifyDone, setVerifyDone] = useState(false);
    const [Disabled, setDisabled] = useState(true)
    const [ShowOtpfield, setShowOtpfield] = useState(false);
    const { showToast } = useToast();
    const [OtpButtonhide, setOtpButtonhide] = useState(true);
    const [MakeEmailInputDisable, setMakeEmailInputDisable] = useState(false);
    const { loginwithGoogle, Register } = useAuth();
    const [eyesymbol, seteyesymbol] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const canEnable =
            ConfirmPassword === Password && ConfirmPasswordError === "" && !Emailerror &&
            VerifyDone && Password.trim() !== "" && ConfirmPassword.trim() !== "" && role
        setDisabled(!canEnable);
    }, [ConfirmPasswordError, Emailerror, VerifyDone, Password, ConfirmPassword, role]);

    useEffect(() => {
        if (ConfirmPassword !== "" && ConfirmPassword !== Password) {
            setConfirmPasswordError("Password not Matching");
        } else {
            setConfirmPasswordError("");
        }
    }, [ConfirmPassword, Password]);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setEmailError(validateEmail(e.target.value))
        setOtpbutton(Emailerror === "" ? false : true);
    }
    const HandelGoogleLogin = async (Email) => {
        try {
            const res = await GoogleSignUpApi(Email);
            if (!res.data.success) {
                showToast(res.data.msg, "error");
                return;
            }
            else {
                navigate("/");
                showToast(res.data.msg, "success")
                loginwithGoogle(res.data);
            }
        }
        catch (error) {
            if (error.response) {
                const msg = error.response.data?.msg || "Request failed";
                showToast(msg, "error");
            }
            else if (error.request) {
                showToast("Server not responding, please try later", "error");
            }
            else {
                showToast("Unexpected error occurred", "error");
            }
        }
    };
    const handleGetOtp = async () => {
        setShowOtpfield(true);
        setOtpButtonhide(false);

        try {
            const res = await otpSendApi(Email);


            if (!res.data.success) {
                showToast(res.data.msg || "Something went wrong", "error");
                return;
            }

            showToast(res.data.msg || "OTP sent successfully", "success");
        }
        catch (error) {
            if (error.response) {
                const msg = error.response.data?.msg || "Request failed";
                showToast(msg, "error");
            }
            else if (error.request) {
                showToast("Server not responding, please try later", "error");
            }
            else {
                showToast("Unexpected error occurred", "error");
            }
        }

    }
    const handleResendOtp = async () => {
        try {
            const res = await otpSendApi(Email);

            if (!res.data.success) {
                showToast(res.data.msg, "error")
                return;
            }
            else {
                showToast(res.data.msg, "success")
            }
        }
        catch (error) {
            console.error(error);
            showToast("Internal Server error", "error");
        }
    };
    const handleRegister = async () => {
        try {
            const res = await registerApi(Email, Password, ConfirmPassword, role);
            if (!res.data.success) {
                showToast(res.data.msg, "error")
            }
            else {
                showToast(res.data.msg, "success")
                Register(res.data);
                if (res.data.Role === "Trainer") {
                    navigate("/");
                }
                else {
                    navigate("/");
                }
            }
        } catch (error) {
            console.error(error);
            showToast("Internal Server error", "error")
        }
    }
    const handleConfirmPassword = (e) => {
        setConfirmPassword(e.target.value)
    }
    const handleVerifyOtp = async (Otp) => {

        try {

            const res = await verifyOtpApi(Email, Otp);

            if (!res.data.success) {
                showToast(res.data.msg, "error");
                return;
            }
            else {
                setVerifyDone(true);
                setShowOtpfield(false);
                setMakeEmailInputDisable(true);
                showToast(res.data.msg, "success");
            }

        } catch (error) {

            console.error(error)
            showToast("Internal Server error", "error")
        }


    }
    const handleChange = (e) => {
        setRole(e.target.value);
    };

    const handleseebutton = () => {
        eyesymbol ? seteyesymbol(false) : seteyesymbol(true);
    }
    return (
        <div className="Register-Main-Component">
            <div className="Register-sub">
                <div className="left-sub-register">
                    <div className="Register-content">
                        <div className="Register-Email">
                            <div className="Email-wrapper">
                                <Input
                                    label="Email"
                                    type="email"
                                    value={Email}
                                    onChange={handleEmailChange}
                                    placeholder="Enter your email"
                                    error={Emailerror}
                                    disabled={MakeEmailInputDisable}
                                />

                                <div className="Email-child">

                                    {VerifyDone && (<div className="verified">verified</div>)
                                    }

                                    {OtpButtonhide && <Lbutton
                                        hadleButtonclick={handleGetOtp}
                                        text="Get Otp"
                                        variant="Primary"
                                        disabled={Otpbutton}
                                    />}

                                </div>
                            </div>
                            <div className="otp-field">
                                {ShowOtpfield && <Otp
                                    isActive={ShowOtpfield}
                                    length={6}
                                    onComplete={handleVerifyOtp}
                                    onResend={handleResendOtp}
                                />}

                            </div>
                        </div>
                        <div>
                            <label>Role</label>

                            <select value={role} onChange={handleChange} required>
                                <option value="">Select Role</option>
                                <option value="User">User</option>
                                <option value="Trainer">Trainer</option>
                            </select>

                            <p>Selected Role: {role}</p>
                        </div>
                        <div className="Register-Password">
                            <Input
                                label="Password"
                                type={eyesymbol ? "password" : "text"}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={"Enter password"}
                            />
                            <Eyebutton hadleButtonclick={handleseebutton} variant="primary" seen={eyesymbol ? "false" : "true"} />
                        </div>
                        <div className="Register-Confirm-Password">
                            <Input
                                label=""
                                type="password"
                                placeholder="Confirm-password"
                                onChange={handleConfirmPassword}
                                error={ConfirmPasswordError}

                            />
                        </div>
                        <div className="register-button">
                            <Lbutton
                                hadleButtonclick={handleRegister}
                                disabled={Disabled}
                                text="Register"
                                variant="Primary"
                            />
                        </div>
                        <div className="last-div">
                            <GoogleLogin
                                onSuccess={credentialResponse => {
                                    const credentialResponseDecoded = jwtDecode(credentialResponse.credential);
                                    console.log(credentialResponseDecoded.email);
                                    HandelGoogleLogin(credentialResponseDecoded.email);
                                }}
                                onError={() => {
                                    console.log('Login Failed');
                                }}
                            />
                            <div className="auth-footer">
                                <p>Already Have a Account?</p>
                                <button className="auth-link-btn" onClick={() => navigate("/Login")}>Login</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="right-image-register">
                </div>
            </div>
        </div>
    )
}
export default Register;
