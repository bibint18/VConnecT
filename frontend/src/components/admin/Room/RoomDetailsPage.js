import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Header from '../header/Header';
import Sidebar from '../sidebar/Sidebar';
import RoomDetails from './RoomDetails';
export default function RoomDetailsPage() {
    return (_jsxs("div", { className: "flex flex-col h-screen", children: [_jsx(Header, {}), _jsxs("div", { className: "flex flex-1 pt-16 ", children: [_jsx(Sidebar, {}), _jsx(RoomDetails, {})] })] }));
}
