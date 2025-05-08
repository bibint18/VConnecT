import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// export default function Footer() {
//   return (
//     <footer className="bg-black py-6 border-t border-gray-800">
//       <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
//         <div className="flex items-center mb-4 sm:mb-0">
//           <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-2">
//             <span className="text-black font-bold text-lg">S</span>
//           </div>
//           <p className="text-sm text-gray-400">© 2023 Company Name, Inc. All rights reserved.</p>
//         </div>
//         <div className="flex space-x-6">
//           <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
//             Terms
//           </a>
//           <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
//             Privacy
//           </a>
//           <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
//             Support
//           </a>
//         </div>
//       </div>
//     </footer>
//   )
// }
// src/components/Footer.jsx
import logo from '../../../assets/logovct1.png';
const Footer = () => {
    return (_jsxs("footer", { className: "bg-black text-white p-4 flex flex-col md:flex-row items-center justify-between", children: [_jsx("div", { className: "flex items-center", children: _jsx("img", { className: "w-46 h-8 bg-gray-500  mr-2", src: logo }) }), _jsx("p", { className: "text-sm", children: "\u00A9 2023 Company Name, Inc. ALL rights reserved." }), _jsxs("div", { className: "flex space-x-4 mt-4 md:mt-0", children: [_jsx("a", { href: "#", className: "text-sm hover:underline", children: "Terms" }), _jsx("a", { href: "#", className: "text-sm hover:underline", children: "Privacy" }), _jsx("a", { href: "#", className: "text-sm hover:underline", children: "Support" })] })] }));
};
export default Footer;
