


// import  { useState } from 'react';
// import { FaUser, FaChartLine, FaPen, FaDoorOpen, FaUserFriends, FaCog } from 'react-icons/fa';

// const Sidebar = () => {
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   const toggleSidebar = () => {
//     setIsCollapsed(!isCollapsed);
//   };

//   return (
//     <div
//       className={`sidebar fixed h-screen text-white p-4 flex flex-col justify-between ${
//         isCollapsed ? 'w-[60px]' : 'w-[200px]'
//       } transition-all duration-300`}
//     >
//       <div>
//         <button
//           onClick={toggleSidebar}
//           className="text-white mb-6 focus:outline-none"
//         >
//           {isCollapsed ? '☰' : '✖'}
//         </button>
//         <ul className="space-y-4">
//           <li
//             className={`flex items-center space-x-4 p-2 rounded ${
//               !isCollapsed ? 'bg-blue-500' : ''
//             }`}
//           >
//             <FaUser className="text-xl" />
//             {!isCollapsed && <span>Profile</span>}
//           </li>
//           <li className="flex items-center space-x-4 p-2 rounded hover:bg-gray-700">
//             <FaChartLine className="text-xl" />
//             {!isCollapsed && <span>Stats</span>}
//           </li>
//           <li className="flex items-center space-x-4 p-2 rounded hover:bg-gray-700">
//             <FaPen className="text-xl" />
//             {!isCollapsed && <span>Posts</span>}
//           </li>
//           <li className="flex items-center space-x-4 p-2 rounded hover:bg-gray-700">
//             <FaDoorOpen className="text-xl" />
//             {!isCollapsed && <span>Rooms</span>}
//           </li>
//           <li className="flex items-center space-x-4 p-2 rounded hover:bg-gray-700">
//             <FaUserFriends className="text-xl" />
//             {!isCollapsed && <span>Friends</span>}
//           </li>
//           <li className="flex items-center space-x-4 p-2 rounded hover:bg-gray-700">
//             <FaCog className="text-xl" />
//             {!isCollapsed && <span>Settings</span>}
//           </li>
//           {!isCollapsed && (
//             <li className="flex items-center space-x-4 p-2 text-gray-500">
//               <span>Premium</span>
//             </li>
//           )}
//         </ul>
//       </div>
//       <button
//         className={`logout-btn py-2 px-4 rounded transition duration-300 ${
//           isCollapsed ? 'w-[40px]' : 'w-full'
//         }`}
//       >
//         {isCollapsed ? '←' : 'Logout ←'}
//       </button>
//     </div>
//   );
// };

// export default Sidebar;




import React from 'react';
import { 
  Home, 
  BarChart2, 
  FileText, 
  Users, 
  Star, 
  Settings, 
  LogOut,
  MessageSquare
} from 'react-feather';

interface NavItem {
  name: string;
  icon: React.ElementType;
  isActive?: boolean;
  path:string
}

const navItems: NavItem[] = [
  { name: 'Profile', icon: Home, isActive: true,path:'/profile' },
  { name: 'Stats', icon: BarChart2,path:'/stats' },
  { name: 'Posts', icon: FileText,path:'/posts' },
  { name: 'Rooms', icon: MessageSquare,path:'/rooms' },
  { name: 'Friends', icon: Users ,path:'/friends'},
  { name: 'Premium', icon: Star ,path:'/premium'},
  { name: 'Setting', icon: Settings ,path:"/settings"},
];

export const Sidebar = () => {
  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-20 md:w-64 bg-black text-white flex flex-col border-r border-gray-800">
      <div className="flex-1 py-6">
        <nav className="space-y-2 px-2">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                ${item.isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-gray-800'
                }
              `}
            >
              <item.icon className="w-6 h-6 flex-shrink-0" />
              <span className="hidden md:block">{item.name}</span>
            </a>
          ))}
        </nav>
      </div>
      
      <div className="p-4">
        <button className="flex items-center space-x-3 w-full px-4 py-3 text-pink-300 hover:bg-gray-800 rounded-lg transition-colors">
          <LogOut className="w-6 h-6" />
          <span className="hidden md:block">Logout</span>
        </button>
      </div>
    </div>
  );
};