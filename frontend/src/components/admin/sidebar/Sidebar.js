import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogout } from "../../../services/authService";
import './sidebar.css';
import { LayoutDashboard, Users, ListChecks, 
// Image,
MessageSquare, 
// CreditCard,
Calendar, Award, 
// LifeBuoy,
// Rss,
BarChart3, LogOut, } from "lucide-react";
const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const handleResize = () => {
            setIsCollapsed(window.innerWidth < 768); // Collapse when screen < 768px
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return (_jsxs("aside", { className: `h-full h-[calc(100vh-64px)] bg-white border-r border-gray-200 transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"} flex flex-col`, children: [_jsx("nav", { className: "flex-1 overflow-y-auto", children: _jsx("ul", { className: "flex flex-col p-2 space-y-2", children: [
                        { label: "Dashboard", icon: LayoutDashboard, path: '/dashboard' },
                        { label: "Customers", icon: Users, path: '/users' },
                        { label: "Plans", icon: ListChecks, path: "/plans" },
                        // { label: "Banners", icon: Image },
                        { label: "Rooms", icon: MessageSquare, path: "/admin/rooms" },
                        // { label: "Payments", icon: CreditCard },
                        { label: "Daily Challenge", icon: Calendar, path: '/trivia' },
                        { label: "Rewards", icon: Award, path: "/admin/rewards" },
                        // { label: "Support", icon: LifeBuoy },
                        // { label: "Feeds", icon: Rss },
                        { label: "Reports", icon: BarChart3, path: "/dashboardPage" },
                    ].map((item, index) => (_jsx("li", { children: _jsxs("a", { onClick: () => {
                                if (item.path)
                                    navigate(item.path);
                            }, className: `flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-all cursor-pointer ${isCollapsed ? "justify-center" : "pl-4"}`, children: [_jsx(item.icon, { className: "h-5 w-5 text-gray-700" }), _jsx("span", { className: `ml-3 transition-all duration-300 ${isCollapsed ? "hidden" : "block"}`, children: item.label })] }) }, index))) }) }), _jsx("div", { className: "p-2 border-t bg-black", onClick: adminLogout, children: _jsxs("p", { className: `flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-all ${isCollapsed ? "justify-center" : "pl-4"}`, children: [_jsx(LogOut, { className: "h-5 w-5 text-gray-700 " }), _jsx("span", { className: `ml-3 transition-all duration-300 ${isCollapsed ? "hidden" : "block"}`, children: "Logout" })] }) })] }));
};
export default Sidebar;
