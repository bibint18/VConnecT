import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/redux/store";
const UserProtectedRoute = () => {
    const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
    return isAuthenticated ? _jsx(Outlet, {}) : _jsx(Navigate, { to: '/login', replace: true });
};
export default UserProtectedRoute;
