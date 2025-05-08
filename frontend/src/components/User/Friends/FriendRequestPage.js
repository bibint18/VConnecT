import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Sidebar } from "../Profile/Sidebar";
import Header from "../Header/Header";
import FriendRequests from "./FriendRequest";
export default function FriendRequestPage() {
    return (_jsxs("div", { className: "flex flex-col min-h-screen bg-black", children: [_jsx("div", { className: "fixed top-0 left-0 w-full z-10", children: _jsx(Header, {}) }), _jsxs("div", { className: "flex flex-1", children: [_jsx(Sidebar, {}), _jsx("main", { className: "flex-1 ml-20 md:ml-64 pt-16", children: _jsx(FriendRequests, {}) })] })] }));
}
