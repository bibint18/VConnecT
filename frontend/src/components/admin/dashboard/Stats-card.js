import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const StatsCard = ({ title, value, gradient = false, gradientColors = 'from-purple-500 to-indigo-600' }) => {
    return (_jsx("div", { className: `rounded-lg ${gradient ? `bg-gradient-to-br ${gradientColors} text-white` : 'bg-white'} p-6 shadow-sm`, children: _jsxs("div", { className: "flex flex-col items-center justify-center", children: [_jsx("h3", { className: `text-sm font-medium mb-2 ${gradient ? 'text-white text-opacity-80' : 'text-gray-500'}`, children: title }), _jsx("p", { className: "text-2xl font-bold", children: value })] }) }));
};
export default StatsCard;
