import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom"
import Loader from "../components/Loader/Loader"
const Register = lazy(() => import("../pages/Register-Login/Register"))
const Login = lazy(() => import("../pages/Register-Login/Login"))
import Dashboard from "../pages/LandingPage/Dashboar";
function AppRoutes() {
    return (
        <Suspense fallback={<Loader />}>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/Register" element={<Register />} />
            </Routes>
        </Suspense>
    )
}

export default AppRoutes;