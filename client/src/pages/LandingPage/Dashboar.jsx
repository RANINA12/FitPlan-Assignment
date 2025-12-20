import Navbar from "../Global Components/Navbar";
// import Footer from "../Global Components/Footer";
import LoggedDashboard from "./LoggedDashboard";
import UnloggedDashboard from "./UnloggedDashBoard";
import TrainerDashboard from "./TrainerDashBoard";
import { useAuth } from "../../context/AuthContext";

function Dashboard() {
    const { user, role } = useAuth();
    return (
        <div>

            <Navbar />
            {!user && <UnloggedDashboard />}

            {user && role === "User" && <LoggedDashboard />}

            {user && role === "Trainer" && <TrainerDashboard />}

        </div>
    );
}

export default Dashboard;
