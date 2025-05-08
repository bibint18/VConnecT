import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { format, isAfter, isBefore, isEqual } from "date-fns";
import { toast } from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, } from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axiosInstance from "@/utils/axiosInterceptor";
const AdminDashboardd = () => {
    const [data, setData] = useState(null);
    const [startDate, setStartDate] = useState(undefined);
    const [endDate, setEndDate] = useState(undefined);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchDashboardData();
    }, [startDate, endDate]);
    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const params = startDate && endDate ? { startDate: startDate.toISOString(), endDate: endDate.toISOString() } : {};
            const response = await axiosInstance.get("/dashboard", {
                params,
            });
            setData(response.data);
        }
        catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to load dashboard data");
        }
        finally {
            setLoading(false);
        }
    };
    const downloadPDF = async () => {
        const doc = new jsPDF();
        doc.text("Admin Dashboard", 20, 20);
        doc.text(`Date Range: ${startDate ? format(startDate, "PPP") : "All"} - ${endDate ? format(endDate, "PPP") : "All"}`, 20, 30);
        if (data) {
            doc.text(`Total Users: ${data.totalUsers}`, 20, 50);
            doc.text(`Premium Users: ${data.premiumUsers}`, 20, 60);
            doc.text(`Total Income: $${data.totalIncome}`, 20, 70);
            doc.text(`Total Rooms: ${data.totalRooms}`, 20, 80);
            doc.text(`Public Rooms: ${data.roomTypes.find(r => r.type === "PUBLIC")?.count || 0}`, 20, 90);
            doc.text(`Private Rooms: ${data.roomTypes.find(r => r.type === "PRIVATE")?.count || 0}`, 20, 100);
        }
        const chart1 = document.getElementById("user-chart");
        const chart2 = document.getElementById("income-chart");
        if (chart1 && chart2) {
            const canvas1 = await html2canvas(chart1);
            const canvas2 = await html2canvas(chart2);
            const imgData1 = canvas1.toDataURL("image/png");
            const imgData2 = canvas2.toDataURL("image/png");
            doc.addImage(imgData1, "PNG", 20, 110, 170, 80);
            doc.addImage(imgData2, "PNG", 20, 200, 170, 80);
        }
        doc.save(`dashboard-${new Date().toISOString().slice(0, 10)}.pdf`);
        toast.success("PDF downloaded");
    };
    const downloadExcel = () => {
        if (!data)
            return;
        const wb = XLSX.utils.book_new();
        const summaryData = [
            ["Metric", "Value"],
            ["Total Users", data.totalUsers],
            ["Premium Users", data.premiumUsers],
            ["Total Income", `$${data.totalIncome}`],
            ["Total Rooms", data.totalRooms],
            ["Public Rooms", data.roomTypes.find(r => r.type === "PUBLIC")?.count || 0],
            ["Private Rooms", data.roomTypes.find(r => r.type === "PRIVATE")?.count || 0],
        ];
        const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
        ws1['!cols'] = [
            { wch: 20 },
            { wch: 15 },
        ];
        XLSX.utils.book_append_sheet(wb, ws1, "Summary");
        const plansData = [["Plan Name", "Count", "Discount Amount"], ...data.popularPlans.map(p => [p.planName, p.count, p.discountAmount])];
        const ws2 = XLSX.utils.aoa_to_sheet(plansData);
        ws2['!cols'] = [
            { wch: 25 },
            { wch: 15 },
            { wch: 20 },
        ];
        XLSX.utils.book_append_sheet(wb, ws2, "Popular Plans");
        const incomeData = [["Year", "Month", "Total"], ...data.incomeOverTime.map(i => [i.year, i.month, i.total])];
        const ws3 = XLSX.utils.aoa_to_sheet(incomeData);
        ws3['!cols'] = [
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
        ];
        XLSX.utils.book_append_sheet(wb, ws3, "Income Over Time");
        const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        saveAs(new Blob([wbout], { type: "application/octet-stream" }), `dashboard-${new Date().toISOString().slice(0, 10)}.xlsx`);
        toast.success("Excel downloaded");
    };
    const today = new Date();
    const handleStartDateSelect = (date) => {
        if (!date) {
            setStartDate(undefined);
            return;
        }
        if (isAfter(date, today)) {
            toast.error("Start date cannot be in the future");
            return;
        }
        setStartDate(date);
        if (endDate && (isBefore(endDate, date) || isEqual(endDate, date))) {
            setEndDate(undefined);
            toast.error("End date has been reset because it was earlier than or equal to the new start date");
        }
    };
    const handleEndDateSelect = (date) => {
        if (!date) {
            setEndDate(undefined);
            return;
        }
        if (isAfter(date, today)) {
            toast.error("End date cannot be in the future");
            return;
        }
        if (startDate && (isBefore(date, startDate) || isEqual(date, startDate))) {
            toast.error("End date must be after the start date");
            return;
        }
        setEndDate(date);
    };
    if (loading)
        return _jsx("div", { className: "text-center mt-10", children: "Loading..." });
    if (!data)
        return _jsx("div", { className: "text-red-500 text-center mt-10", children: "Failed to load data" });
    return (_jsxs("div", { className: "container !bg-pink-50 mx-auto p-6 !text-black", children: [_jsx("h1", { className: "text-3xl font-bold mb-6", children: "Admin Dashboard" }), _jsxs("div", { className: "mb-6 flex gap-4", children: [_jsxs(Popover, { children: [_jsx(PopoverTrigger, { asChild: true, children: _jsxs(Button, { variant: "outline", children: [_jsx(CalendarIcon, { className: "mr-2 h-4 w-4" }), startDate ? format(startDate, "PPP") : "Start Date"] }) }), _jsx(PopoverContent, { className: "w-auto p-0", children: _jsx(Calendar, { mode: "single", selected: startDate, onSelect: handleStartDateSelect, initialFocus: true, disabled: (date) => isAfter(date, today), classNames: {
                                        day_disabled: "!text-gray-400 !cursor-not-allowed",
                                    } }) })] }), _jsxs(Popover, { children: [_jsx(PopoverTrigger, { asChild: true, children: _jsxs(Button, { variant: "outline", children: [_jsx(CalendarIcon, { className: "mr-2 h-4 w-4" }), endDate ? format(endDate, "PPP") : "End Date"] }) }), _jsx(PopoverContent, { className: "w-auto p-0", children: _jsx(Calendar, { mode: "single", selected: endDate, onSelect: handleEndDateSelect, initialFocus: true, disabled: (date) => (startDate && (isBefore(date, startDate) || isEqual(date, startDate))) ||
                                        isAfter(date, today), classNames: {
                                        day_disabled: "!text-gray-400 !cursor-not-allowed",
                                    } }) })] }), _jsx(Button, { onClick: () => { setStartDate(undefined); setEndDate(undefined); }, children: "Clear Dates" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "User Creation Over Time" }) }), _jsx(CardContent, { id: "user-chart", children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(LineChart, { data: data.userCreationOverTime, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: (d) => `${d.month}/${d.year}`, tickFormatter: (value) => value }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Legend, {}), _jsx(Line, { type: "monotone", dataKey: "count", stroke: "#8884d8" })] }) }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Income Over Time" }) }), _jsx(CardContent, { id: "income-chart", children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(LineChart, { data: data.incomeOverTime, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: (d) => `${d.month}/${d.year}`, tickFormatter: (value) => value }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Legend, {}), _jsx(Line, { type: "monotone", dataKey: "total", stroke: "#82ca9d" })] }) }) })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Total Users" }) }), _jsx(CardContent, { children: _jsx("p", { className: "text-2xl font-bold", children: data.totalUsers }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Premium Users" }) }), _jsx(CardContent, { children: _jsx("p", { className: "text-2xl font-bold", children: data.premiumUsers }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Total Rooms" }) }), _jsx(CardContent, { children: _jsx("p", { className: "text-2xl font-bold", children: data.totalRooms }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Public Rooms" }) }), _jsx(CardContent, { children: _jsx("p", { className: "text-2xl font-bold", children: data.roomTypes.find(r => r.type === "PUBLIC")?.count || 0 }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Private Rooms" }) }), _jsx(CardContent, { children: _jsx("p", { className: "text-2xl font-bold", children: data.roomTypes.find(r => r.type === "PRIVATE")?.count || 0 }) })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Most Purchased Plans" }) }), _jsx(CardContent, { children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Plan Name" }), _jsx(TableHead, { children: "Purchases" }), _jsx(TableHead, { children: "Discount Amount" })] }) }), _jsx(TableBody, { children: data.popularPlans.map((plan) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: plan.planName }), _jsx(TableCell, { children: plan.count }), _jsxs(TableCell, { children: ["$", plan.discountAmount] })] }, plan.planName))) })] }) })] }), _jsxs("div", { className: "mt-6 flex gap-4", children: [_jsx(Button, { onClick: downloadPDF, children: "Download PDF" }), _jsx(Button, { onClick: downloadExcel, children: "Download Excel" })] })] }));
};
export default AdminDashboardd;
