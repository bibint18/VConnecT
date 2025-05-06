

import React from 'react';
import { 
  Home, 
  BarChart2, 
  FileText, 
  Users, 
  Star, 
  // Settings, 
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
  { name: 'Reward', icon: BarChart2,path:'/rewards' },
  { name: 'Posts', icon: FileText,path:'/myPost' },
  { name: 'Rooms', icon: MessageSquare,path:'/rooms' },
  { name: 'Friends', icon: Users ,path:'/friends/request'},
  { name: 'Premium', icon: Star ,path:'/user/plans'},
  // { name: 'Setting', icon: Settings ,path:"/settings"},
];
import { logoutTheUser } from '@/redux/userSlice.js';
import { useAppDispatch } from '@/redux/store';
export const Sidebar = () => {
const dispatch = useAppDispatch()
const logout = () => {
  dispatch(logoutTheUser())
}
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
        <button onClick={logout} className="flex items-center space-x-3 w-full px-4 py-3 text-pink-300 hover:bg-gray-800 rounded-lg transition-colors">
          <LogOut className="w-6 h-6" />
          <span className="hidden md:block">Logout</span>
        </button>
      </div>
    </div>
  );
};