import Input from "../../components/Inputs/Inputs";
import { validateEmail } from "../../Utils/validator";
import Lbutton from "../../components/Buttons/Lbutton";
import Eyebutton from "../../components/Buttons/Eyebutton";
import { useEffect, useState } from "react";
import { useToast } from "../../context/ToastContext";
import { loginApi } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Login.css"
import { GoogleLogin } from '@react-oauth/google';
function Login() {
    const [Password, setPassword] = useState("");
    const [Email, setEmail] = useState("");
    const [Emailerror, setEmailError] = useState("");
    const [Disabled, setDisabled] = useState(true);
    const [eyesymbol, seteyesymbol] = useState(false);
    const { showToast } = useToast();
    const { login, loginwithGoogle } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        const isValid =
            Email !== "" &&
            Password !== "" &&
            Emailerror === "";

        setDisabled(!isValid);
    }, [Email, Password, Emailerror]);


    const handleseebutton = () => {
        eyesymbol ? seteyesymbol(false) : seteyesymbol(true);
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setEmailError(validateEmail(e.target.value));
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const handlesumbitLogin = async () => {

        try {
            const res = await loginApi(Email, Password);

            if (!res.data.success) {
                showToast(res.data.msg, "error");
                setEmail("");
                setPassword("");
                return;
            }
            login(res.data);
            showToast(res.data.msg, "success");
            navigate("/");
        }
        catch (error) {
            showToast("Internal server error", "error");
            // for developer 
            console.error(error)
        }
    }

    const HandelGoogleLogin = async (Email) => {
        try {
            const res = await GoogleSignUpApi(Email);
            if (!res.data.success) {
                showToast(res.data.msg, "error");
            }
            else {
                showToast(res.data.msg, "success")
                loginwithGoogle(res.data);
                if (res.data.Role == "User") {
                    navigate("/")
                }
                else {
                    navigate("/")
                }
            }
        }
        catch (err) {
            console.error(err)
            showToast("Internal Server error", "error")
        }
    };
    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-form">
                    <div className="auth-header">
                        <h1 className="auth-title">Login</h1>
                        <p className="auth-subtitle">
                            Access your account in just a few clicks.
                        </p>
                    </div>
                    <div className="auth-input-group">
                        <Input
                            label="Email"
                            type="email"
                            value={Email}
                            onChange={handleEmailChange}
                            placeholder="Enter your email"
                            error={Emailerror}
                        />
                    </div>
                    <div className="auth-input-group auth-password-group">
                        <Input
                            label="Password"
                            type={eyesymbol ? "password" : "text"}
                            value={Password}
                            onChange={handlePasswordChange}
                            placeholder="Password"
                        />
                        <Eyebutton
                            hadleButtonclick={handleseebutton}
                            variant="primary"
                            seen={eyesymbol ? "false" : "true"}
                        />
                    </div>
                    <div className="auth-forgot">
                        <button className="auth-forgot-btn">Forgot Password?</button>
                    </div>
                    <div className="auth-submit">
                        <Lbutton
                            hadleButtonclick={handlesumbitLogin}
                            text="Login"
                            disabled={Disabled}
                            variant="primary"
                        />
                    </div>
                    <div>
                        <GoogleLogin
                            onSuccess={credentialResponse => {
                                const credentialResponseDecoded = jwtDecode(credentialResponse.credential);
                                HandelGoogleLogin(credentialResponseDecoded);
                            }}
                            onError={() => {
                                console.log('Login Failed');
                            }}
                        />
                    </div>
                    <br></br>
                    <div className="auth-footer">
                        <p>Don't have an account?</p>
                        <button className="auth-link-btn" onClick={() => navigate("/Register")}>Create Account</button>
                    </div>

                </div>
                <div className="auth-side">
                    <div className="auth-side-image">
                        {/* This will be simple, no glow-gimmick */}
                        {/* You can add illustration, pattern, or light gradient */}
                    </div>
                </div>

            </div>

        </div>
    );


}

export default Login;