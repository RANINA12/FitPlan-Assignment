import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom"
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(sessionStorage.getItem("user")) || null;
    const [role, Setrole] = useState(sessionStorage.getItem("role") || null);
    const navigate = useNavigate();
    const refreshAccessToken = async (refreshToken) => {
        try {
            const res = await api.post("/api/refresh", { refreshToken });
            sessionStorage.setItem("accessToken", res.data.accessToken);
            setUser(sessionStorage.getItem("user"));
        } catch (error) {
            logout();
        }
    };
    useEffect(() => {
        const user = sessionStorage.getItem("user");
        const access = sessionStorage.getItem("accessToken"); // spelling fix
        if (user && access) {
            setUser(user);
        } else if (user && !access && refresh) {
            refreshAccessToken(refresh);
        } else {
            setUser(null);
        }
    }, []);

    const login = (userData) => {
        sessionStorage.setItem("accessToken", userData.accessToken);
        sessionStorage.setItem("user", userData.User);
        sessionStorage.setItem("role", userData.Role)
        setUser(userData.User);
        Setrole(userData.Role);

    };
    const loginwithGoogle = (userData) => {
        sessionStorage.setItem("accessToken", userData.accessToken);
        sessionStorage.setItem("user", userData.User);
        sessionStorage.setItem("role", userData.Role)
        setUser(userData.User);
        Setrole(userData.Role);
    }

    const Register = (userData) => {
        sessionStorage.setItem("accessToken", userData.accessToken);
        sessionStorage.setItem("user", userData.User);
        sessionStorage.setItem("role", userData.Role)
        setUser(userData.User);
        Setrole(userData.Role);
    }

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("role")
        navigate("/");
    };



    return (
        <AuthContext.Provider value={{ user, login, logout, loginwithGoogle, Register, role }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
