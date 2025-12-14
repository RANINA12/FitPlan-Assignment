import { useEffect, useState, useContext } from "react";
import Navbar from "../Global Components/Navbar";
import Card from "../Global Components/Card";
import { fetchDataforUnloggedUser } from "../../api/auth";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";

function UnloggedDashboard() {
    const { user, Role } = useAuth();
    const [data, setData] = useState([]);
    const [error, setError] = useState("");
    const { showToast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetchDataforUnloggedUser();

                if (res.data?.success) {
                    setData(res.data.list);
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

        fetchData();
    }, []);

    return (
        <div className="Main-Container">


            <Card
                user={user}
                data={data}
            />

            {error && <p className="error">{error}</p>}
        </div>
    );
}

export default UnloggedDashboard;
