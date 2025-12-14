import { useEffect, useState, useContext } from "react";
import Card from "../Global Components/Card";
import { fetchDataforloggedUser } from "../../api/auth";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
function LoggedDashboard() {
    const [data, setData] = useState([]);
    const [error, setError] = useState("");
    const { showToast } = useToast();
    const { user, role } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("list")
                const res = await fetchDataforloggedUser(user);

                if (res.data?.success) {
                    setData(res.data.list);
                    console.log("list", res.data.list);
                } else {
                    showToast("Failed to load data", "error");
                }

            } catch (err) {
                if (err.response) {
                    showToast(
                        err.response.data?.msg || "Request failed",
                        "error"
                    );
                } else {
                    showToast("Network error", "error");
                }
                setError("Unable to fetch data");
            }
        };

        if (user) {
            fetchData();
        }
    }, [user]);

    return (
        <div className="Main-Container">

            <Card
                user={user}
                data={data}
            />
            {error && <p className="error">{error}</p>}

            <button onClick={() => navigate("/userProfie")}> See Profile </button>
        </div>
    );
}

export default LoggedDashboard;
