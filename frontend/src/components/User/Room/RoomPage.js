import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Sidebar } from "../Profile/Sidebar";
import ListRoom from "./ListRoom";
import Header from "../Header/Header";
export default function RoomPage() {
    return (_jsxs("div", { className: "flex flex-col min-h-screen", children: [_jsx("div", { className: "fixed top-0 left-0 w-full z-10", children: _jsx(Header, {}) }), _jsxs("div", { className: "flex flex-1", children: [_jsx(Sidebar, {}), _jsx("div", { className: "flex-1 pt-16", children: _jsx(ListRoom, {}) })] })] }));
}
