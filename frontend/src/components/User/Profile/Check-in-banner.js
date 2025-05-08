import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
export function CheckInBanner() {
    return (_jsx(Card, { className: "mb-6 bg-gradient-to-r from-pink-500/20 to-purple-500/20", children: _jsxs(CardHeader, { className: "flex-row items-center justify-between space-y-0", children: [_jsxs("div", { className: "space-y-1", children: [_jsx(CardTitle, { children: "Check in" }), _jsx(CardDescription, { children: "Check in daily to maintain your streak and stay on the leaderboard! Keep your progress going and secure your top spot." })] }), _jsxs(Button, { className: "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600", children: [_jsx(CalendarCheck, { className: "mr-2 h-4 w-4" }), "Check In"] })] }) }));
}
