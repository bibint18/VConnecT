// import React from 'react';
// import { LayoutDashboard, Users, Crown, ListChecks, Image, MessageSquare, CreditCard, Calendar, Award, LifeBuoy, Rss, BarChart3, Settings } from 'lucide-react';

// interface NavItemProps {
//   icon: React.ReactNode;
//   label: string;
//   isActive?: boolean;
// }

// const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive = false }) => {
//   return (
//     <li className={`relative px-3 py-2 ${isActive ? 'bg-gray-100' : ''}`}>
//       <a href="#" className="flex items-center gap-3 text-gray-700 hover:text-black">
//         <span className="text-gray-500 w-5 h-5">{icon}</span>
//         <span className={`text-sm ${isActive ? 'font-medium' : ''}`}>{label}</span>
//       </a>
//     </li>
//   );
// };

// const Sidebar: React.FC = () => {
//   return (
//     <aside className="flex flex-col justify-between h-screen bg-white border-r border-gray-200 w-56">
//       <nav className="flex-1 overflow-y-auto">
//         <ul className="space-y-1 py-2">
//           <NavItem icon={<LayoutDashboard />} label="Dashboard" isActive={true} />
//           <NavItem icon={<Users />} label="Customers" />
//           <NavItem icon={<Crown />} label="Premium Users" />
//           <NavItem icon={<ListChecks />} label="Plans" />
//           <NavItem icon={<Image />} label="Banners" />
//           <NavItem icon={<MessageSquare />} label="Rooms" />
//           <NavItem icon={<CreditCard />} label="Payments" />
//           <NavItem icon={<Calendar />} label="Daily challenge" />
//           <NavItem icon={<Award />} label="Rewards" />
//           <NavItem icon={<LifeBuoy />} label="Support" />
//           <NavItem icon={<Rss />} label="Feeds" />
//           <NavItem icon={<BarChart3 />} label="Reports" />
//         </ul>
//       </nav>
//       <div className="border-t border-gray-200 py-2">
//         <NavItem icon={<Settings />} label="Admin" />
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;



// import React, { useState, useEffect } from 'react';
// import {
//   LayoutDashboard,
//   Users,
//   ListChecks,
//   Image,
//   MessageSquare,
//   CreditCard,
//   Calendar,
//   Award,
//   LifeBuoy,
//   Rss,
//   BarChart3,
// } from 'lucide-react';
// import logo from '../../../assets/logovct1.png'
// const Sidebar: React.FC = () => {
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   // Function to handle window resize
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth < 600) {
//         setIsCollapsed(true);
//       } else {
//         setIsCollapsed(false);
//       }
//     };

//     // Set initial state
//     handleResize();

//     // Add event listener for window resize
//     window.addEventListener('resize', handleResize);

//     // Cleanup event listener
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   return (
//     <aside className={`fixed left-0 top-16 h-[calc(100vh-64px)] bg-white border-r border-gray-200 p-4 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
//       {/* Logo */}
//       {/* <div className="flex items-center justify-center py-4 border-b border-gray-200">
//         <img
//           src={logo} // Replace with your logo image path
//           alt="Logo"
//           className={`${isCollapsed ? 'h-8 w-auto' : 'h-10 w-auto'} transition-all duration-300`}
//         />
//       </div> */}

//       {/* Menu Items */}
//       <nav className="flex-1 overflow-y-auto">
//         <ul className="space-y-1 p-2">
//           {/* Dashboard */}
//           <li>
//             <a
//               href="#"
//               className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
//             >
//               <LayoutDashboard className="h-5 w-5" />
//               {!isCollapsed && <span className="ml-3">Dashboard</span>}
//             </a>
//           </li>

//           {/* Customers */}
//           <li>
//             <a
//               href="#"
//               className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
//             >
//               <Users className="h-5 w-5" />
//               {!isCollapsed && <span className="ml-3">Customers</span>}
//             </a>
//           </li>

//           {/* Plans */}
//           <li>
//             <a
//               href="#"
//               className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
//             >
//               <ListChecks className="h-5 w-5" />
//               {!isCollapsed && <span className="ml-3">Plans</span>}
//             </a>
//           </li>

//           {/* Banners */}
//           <li>
//             <a
//               href="#"
//               className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
//             >
//               <Image className="h-5 w-5" />
//               {!isCollapsed && <span className="ml-3">Banners</span>}
//             </a>
//           </li>

//           {/* Rooms */}
//           <li>
//             <a
//               href="#"
//               className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
//             >
//               <MessageSquare className="h-5 w-5" />
//               {!isCollapsed && <span className="ml-3">Rooms</span>}
//             </a>
//           </li>

//           {/* Payments */}
//           <li>
//             <a
//               href="#"
//               className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
//             >
//               <CreditCard className="h-5 w-5" />
//               {!isCollapsed && <span className="ml-3">Payments</span>}
//             </a>
//           </li>

//           {/* Daily Challenge */}
//           <li>
//             <a
//               href="#"
//               className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
//             >
//               <Calendar className="h-5 w-5" />
//               {!isCollapsed && <span className="ml-3">Daily Challenge</span>}
//             </a>
//           </li>

//           {/* Rewards */}
//           <li>
//             <a
//               href="#"
//               className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
//             >
//               <Award className="h-5 w-5" />
//               {!isCollapsed && <span className="ml-3">Rewards</span>}
//             </a>
//           </li>

//           {/* Support */}
//           <li>
//             <a
//               href="#"
//               className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
//             >
//               <LifeBuoy className="h-5 w-5" />
//               {!isCollapsed && <span className="ml-3">Support</span>}
//             </a>
//           </li>

//           {/* Feeds */}
//           <li>
//             <a
//               href="#"
//               className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
//             >
//               <Rss className="h-5 w-5" />
//               {!isCollapsed && <span className="ml-3">Feeds</span>}
//             </a>
//           </li>

//           {/* Reports */}
//           <li>
//             <a
//               href="#"
//               className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
//             >
//               <BarChart3 className="h-5 w-5" />
//               {!isCollapsed && <span className="ml-3">Reports</span>}
//             </a>
//           </li>
//         </ul>
//       </nav>
//     </aside>
//   );
// };

// export default Sidebar;

import React, { useState, useEffect } from "react";
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
      className={`h-[calc(100vh-64px)] bg-white border-r border-gray-200 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      } flex flex-col`}
    >
      {/* Menu List (Scrollable when needed) */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="flex flex-col p-2 space-y-2">
          {[
            { label: "Dashboard", icon: LayoutDashboard },
            { label: "Customers", icon: Users },
            { label: "Plans", icon: ListChecks },
            { label: "Banners", icon: Image },
            { label: "Rooms", icon: MessageSquare },
            { label: "Payments", icon: CreditCard },
            { label: "Daily Challenge", icon: Calendar },
            { label: "Rewards", icon: Award },
            { label: "Support", icon: LifeBuoy },
            { label: "Feeds", icon: Rss },
            { label: "Reports", icon: BarChart3 },
          ].map((item, index) => (
            <li key={index}>
              <a
                href="#"
                className={`flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-all ${
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
      <div className="p-2 border-t">
        <a
          href="#"
          className={`flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-all ${
            isCollapsed ? "justify-center" : "pl-4"
          }`}
        >
          <LogOut className="h-5 w-5 text-gray-700" />
          <span className={`ml-3 transition-all duration-300 ${isCollapsed ? "hidden" : "block"}`}>
            Logout
          </span>
        </a>
      </div>
      
    </aside>
  );
};

export default Sidebar;


