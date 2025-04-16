

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogout } from "../../../services/authService";
import './sidebar.css'
import {
  LayoutDashboard,
  Users,
  ListChecks,
  Image,
  MessageSquare,
  CreditCard,
  Calendar,
  Award,
  LifeBuoy,
  Rss,
  BarChart3,
  LogOut,
} from "lucide-react";

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate()
  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 768); // Collapse when screen < 768px
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <aside
      className={`h-full h-[calc(100vh-64px)] bg-white border-r border-gray-200 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      } flex flex-col`}
    >
      {/* Menu List (Scrollable when needed) */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="flex flex-col p-2 space-y-2">
          {[
            { label: "Dashboard", icon: LayoutDashboard ,path:'/dashboard'},
            { label: "Customers", icon: Users ,path:'/users'},
            { label: "Plans", icon: ListChecks ,path:"/plans"},
            { label: "Banners", icon: Image },
            { label: "Rooms", icon: MessageSquare ,path:"/admin/rooms"},
            { label: "Payments", icon: CreditCard },
            { label: "Daily Challenge", icon: Calendar,path:'/trivia' },
            { label: "Rewards", icon: Award,path:"/admin/rewards" },
            { label: "Support", icon: LifeBuoy },
            { label: "Feeds", icon: Rss },
            { label: "Reports", icon: BarChart3 },
          ].map((item, index) => (
            <li key={index} >
              <a onClick={() => {
                  if (item.path) navigate(item.path); 
                }}
                
                className={`flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-all cursor-pointer ${
                  isCollapsed ? "justify-center" : "pl-4"
                }`}
              >
                <item.icon className="h-5 w-5 text-gray-700" />
                <span className={`ml-3 transition-all duration-300 ${isCollapsed ? "hidden" : "block"}`}>
                  {item.label}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button (Always Visible) */}
      <div className="p-2 border-t bg-black" onClick={adminLogout}>
        <p
          
          className={`flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-all ${
            isCollapsed ? "justify-center" : "pl-4"
          }`}
        >
          <LogOut className="h-5 w-5 text-gray-700 " />
          <span className={`ml-3 transition-all duration-300 ${isCollapsed ? "hidden" : "block"}`}>
            Logout
          </span>
        </p>
      </div>
      
    </aside>
  );
};

export default Sidebar;


