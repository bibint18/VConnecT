import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import logo from '../../../assets/logovct1.png';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { logoutTheUser } from '../../../redux/userSlice';
import { useNavigate } from 'react-router-dom';
const Header = () => {
    const navigate = useNavigate();
    const { name, isAuthenticated, accessToken } = useAppSelector((state) => state.user);
    console.log("name", name, isAuthenticated, accessToken);
    const dispatch = useAppDispatch();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const handleUserLogout = () => {
        dispatch(logoutTheUser());
        setIsMenuOpen(false);
    };
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    return (_jsxs("header", { className: "bg-white text-black p-4 flex justify-between items-center relative z-50", children: [_jsx("div", { className: "flex items-center space-x-2", children: _jsx("img", { className: "w-36", src: logo, alt: "Logo" }) }), _jsxs("nav", { className: "hidden md:flex space-x-6", children: [_jsx("a", { href: "/", className: "hover:text-purple-500", children: "Home" }), _jsx("a", { href: "/friends", className: "hover:text-purple-500", children: "Friends" }), _jsx("a", { href: "/profile", className: "hover:text-purple-500", children: "Profile" }), _jsx("a", { href: "/dailyTrivia", className: "hover:text-purple-500", children: "Daily Trivia" }), _jsx("a", { href: "/feed", className: "hover:text-purple-500", children: "Community" })] }), _jsx("div", { className: "hidden md:flex items-center space-x-4", children: isAuthenticated ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "text-gray-700", children: name }), _jsx("button", { onClick: handleUserLogout, className: "bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full hover:scale-105 transition", children: "LOGOUT" })] })) : (_jsx("button", { className: "bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full hover:scale-105 transition", onClick: () => navigate('/login'), children: "LOGIN" })) }), _jsx("div", { className: "md:hidden", children: _jsx("button", { className: "!text-black focus:outline-none", onClick: toggleMenu, "aria-label": isMenuOpen ? "Close menu" : "Open menu", children: isMenuOpen ? (_jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M6 18L18 6M6 6l12 12" }) })) : (_jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M4 6h16M4 12h16m-7 6h7" }) })) }) }), isMenuOpen && (_jsx("div", { className: `absolute top-[calc(100%+0.5rem)] right-0 w-64 !bg-white !shadow-xl md:hidden z-50 !rounded-lg !border !border-gray-200 transition-all duration-300 ease-in-out ${isMenuOpen ? '!opacity-100 !translate-y-0' : '!opacity-0 !-translate-y-4 !pointer-events-none'}`, children: _jsxs("nav", { className: "!flex !flex-col !p-4 !space-y-3", children: [_jsx("a", { href: "/", className: "!text-black !font-medium hover:!text-purple-500 !py-2 !px-3 !rounded-md hover:!bg-gray-100", onClick: () => setIsMenuOpen(false), children: "Home" }), _jsx("a", { href: "#", className: "!text-black !font-medium hover:!text-purple-500 !py-2 !px-3 !rounded-md hover:!bg-gray-100", onClick: (e) => {
                                e.preventDefault();
                                setIsMenuOpen(false);
                            }, children: "About" }), _jsx("a", { href: "/friends", className: "!text-black !font-medium hover:!text-purple-500 !py-2 !px-3 !rounded-md hover:!bg-gray-100", onClick: () => setIsMenuOpen(false), children: "Friends" }), _jsx("a", { href: "/profile", className: "!text-black !font-medium hover:!text-purple-500 !py-2 !px-3 !rounded-md hover:!bg-gray-100", onClick: () => setIsMenuOpen(false), children: "Profile" }), _jsx("a", { href: "/dailyTrivia", className: "!text-black !font-medium hover:!text-purple-500 !py-2 !px-3 !rounded-md hover:!bg-gray-100", onClick: () => setIsMenuOpen(false), children: "Daily Trivia" }), _jsx("a", { href: "/feed", className: "!text-black !font-medium hover:!text-purple-500 !py-2 !px-3 !rounded-md hover:!bg-gray-100", onClick: () => setIsMenuOpen(false), children: "Community" }), isAuthenticated ? (_jsxs("div", { className: "!flex !flex-col !space-y-3 !mt-2", children: [_jsx("span", { className: "!text-gray-700 !font-medium !py-2 !px-3", children: name }), _jsx("button", { onClick: () => {
                                        handleUserLogout();
                                        setIsMenuOpen(false);
                                    }, className: "!bg-gradient-to-r !from-purple-500 !to-pink-500 !text-white !px-4 !py-2 !rounded-full hover:!scale-105 !transition !text-left hover:!from-purple-600 hover:!to-pink-600", children: "LOGOUT" })] })) : (_jsx("button", { className: "!bg-gradient-to-r !from-purple-500 !to-pink-500 !text-white !px-4 !py-2 !rounded-full hover:!scale-105 !transition !text-left hover:!from-purple-600 hover:!to-pink-600", onClick: () => {
                                navigate('/login');
                                setIsMenuOpen(false);
                            }, children: "LOGIN" }))] }) }))] }));
};
export default Header;
