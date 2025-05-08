import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../redux/store";
const ProtectedRoute = () => {
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    return isAuthenticated ? _jsx(Outlet, {}) : _jsx(Navigate, { to: "/adminLogin" });
};
export default ProtectedRoute;
