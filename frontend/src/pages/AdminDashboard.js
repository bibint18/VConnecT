import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Header from '../components/admin/header/Header';
import Sidebar from '../components/admin/sidebar/Sidebar';
export default function AdminDashboardd() {
    return (_jsxs("div", { className: "flex flex-col h-screen", children: [_jsx(Header, {}), _jsxs("div", { className: "flex flex-1 pt-16 bg-white", children: [_jsx(Sidebar, {}), _jsx("h1", { className: 'mt-[228px] ml-[403px] !text-2xl', children: "Welcome to the Admin Dashboard" })] })] }));
}
