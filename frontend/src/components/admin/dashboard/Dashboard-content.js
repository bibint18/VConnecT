import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Chart from './Chart';
import StatsCard from './Stats-card';
import Visitors from './Visitors';
import Filter from './Filter';
import DownloadReport from './Download-report';
const DashboardContent = () => {
    return (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6 p-6", children: [_jsxs("div", { className: "lg:col-span-2 space-y-6", children: [_jsx(Chart, {}), _jsx(Visitors, {})] }), _jsxs("div", { className: "space-y-6", children: [_jsx(StatsCard, { title: "Total Premium", value: "\u20B9 5,55,000" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(StatsCard, { title: "User Dropped", value: "2,500" }), _jsx(StatsCard, { title: "New Premium", value: "1033", gradient: true, gradientColors: "from-purple-600 to-indigo-700" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(StatsCard, { title: "Total Users", value: "3033" }), _jsx(StatsCard, { title: "New Users", value: "103", gradient: true, gradientColors: "from-purple-600 to-indigo-700" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(StatsCard, { title: "Not Renewed", value: "500" }), _jsx(StatsCard, { title: "Total Premium", value: "2222", gradient: true, gradientColors: "from-purple-600 to-indigo-700" })] }), _jsx(Filter, {}), _jsx(DownloadReport, {})] })] }));
};
export default DashboardContent;
