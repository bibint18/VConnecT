import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import logo from '../../../assets/logovct1.png';
const Header = () => {
    return (_jsx("header", { className: "w-full bg-white shadow-md fixed top-0 left-0 right-0 z-50", children: _jsxs("div", { className: " mx-auto px-6 py-4 flex justify-between items-center", children: [_jsx("div", { className: "flex items-center", children: _jsx("img", { src: logo, alt: "Logo", className: "h-10 w-auto" }) }), _jsx("div", { className: "flex items-center", children: _jsx("span", { className: "text-gray-700 font-medium text-lg", children: "Admin" }) })] }) }));
};
export default Header;
