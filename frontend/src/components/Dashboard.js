import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAppDispatch } from '../redux/store';
import { logout } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
function Dashboard() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const handleLogout = () => {
        dispatch(logout());
        navigate("/adminLogin");
    };
    return (_jsxs("div", { children: [_jsx("h1", { style: { color: "black" }, children: "Admin Dashboard" }), _jsx("button", { onClick: handleLogout, children: "LOGOUT" })] }));
}
export default Dashboard;
