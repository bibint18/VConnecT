// import React from 'react';
// import { Settings } from 'lucide-react';

// const Header: React.FC = () => {
//   return (
//     <header className="w-full flex justify-between items-center px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
//       <div className="flex items-center gap-4">
//         {/* Logo Image */}
//         <div className="text-black">
//           <img
//             src="/logo.png" // Replace with your logo image path
//             alt="VConnecT Logo"
//             className="h-10 w-auto" // Adjust height and width as needed
//           />
//         </div>
//       </div>
//       <div className="flex items-center">
//         <button className="flex items-center gap-2 text-gray-700 font-medium hover:text-gray-900 transition-colors">
//           <Settings className="h-5 w-5" />
//           <span>ADMIN</span>
//         </button>
//       </div>
//     </header>
//   );
// };

// export default Header;



import React from 'react';
import logo from '../../../assets/logovct1.png'
const Header: React.FC = () => {
  return (
    <header className="w-full bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className=" mx-auto px-6 py-4 flex justify-between items-center">
        {/* Left Side: Logo */}
        <div className="flex items-center">
          <img
            src={logo} 
            alt="Logo"
            className="h-10 w-auto" 
          />
        </div>

        {/* Right Side: Admin Text */}
        <div className="flex items-center">
          <span className="text-gray-700 font-medium text-lg">Admin</span>
        </div>
      </div>
    </header>
  );
};

export default Header;