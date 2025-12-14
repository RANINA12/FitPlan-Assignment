import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom"
import Loader from "../components/Loader/Loader"
const Register = lazy(() => import("../pages/Register-Login/Register"))
const Login = lazy(() => import("../pages/Register-Login/Login"))
const UserAction = lazy(() => import("../pages/LandingPage/UserAction"))
const Description = lazy(() => import("../pages/LandingPage/Description"))
import Dashboard from "../pages/LandingPage/Dashboar";
function AppRoutes() {
    return (
        <Suspense fallback={<Loader />}>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/Register" element={<Register />} />
                <Route path="/User/Profile" element={<UserAction />} />
                <Route path="/plan/:uuid" element={<Description />} />
            </Routes>
        </Suspense>
    )
}

export default AppRoutes;