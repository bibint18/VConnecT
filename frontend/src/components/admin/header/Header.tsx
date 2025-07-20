

import React from 'react';
import logo from '../../../assets/logovct1.png'
const Header: React.FC = () => {
  return (
    <header className="w-full bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className=" mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <img
            src={logo} 
            alt="Logo"
            className="h-10 w-auto" 
          />
        </div>
        <div className="flex items-center">
          <span className="text-gray-700 font-medium text-lg">Admin</span>
        </div>
      </div>
    </header>
  );
};

export default Header;