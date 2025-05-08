import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Download, ChevronDown } from 'lucide-react';
const DownloadReport = () => {
    return (_jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm", children: [_jsx("h2", { className: "text-lg font-semibold mb-4", children: "Download Report" }), _jsxs("div", { className: "flex items-center bg-gray-100 rounded-lg overflow-hidden", children: [_jsx("div", { className: "py-2 px-4 text-gray-700 text-sm", children: _jsx("span", { children: "Download Report" }) }), _jsxs("div", { className: "flex items-center gap-1 py-2 px-3 bg-gray-200 text-gray-700 text-sm", children: [_jsx("span", { children: "PDF" }), _jsx(ChevronDown, { className: "w-4 h-4" })] }), _jsx("button", { className: "p-2 bg-purple-600 text-white hover:bg-purple-700 transition-colors", children: _jsx(Download, { className: "w-4 h-4" }) })] })] }));
};
export default DownloadReport;
