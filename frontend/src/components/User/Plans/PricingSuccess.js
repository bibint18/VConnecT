import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
const PricingSuccess = () => {
    const navigate = useNavigate();
    return (_jsx("div", { className: "min-h-[calc(100vh-4rem)] bg-black text-white px-4 sm:px-6 py-12 flex flex-col items-center ml-20 md:ml-64 pt-16", children: _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "text-center", children: [_jsx("h1", { className: "text-3xl sm:text-4xl font-bold mb-6", children: "Payment Successful!" }), _jsx("p", { className: "text-gray-300 mb-8", children: "Your plan has been activated. Enjoy your new features!" }), _jsx("button", { onClick: () => navigate("/user/plans"), className: "py-2 px-6 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white font-semibold hover:brightness-110 transition-all duration-300", children: "Back to Plans" })] }) }));
};
export default PricingSuccess;
