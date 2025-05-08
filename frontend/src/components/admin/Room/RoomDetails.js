"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRoomDetails } from "@/services/roomService";
export default function RoomDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchRoomDetails = async () => {
            if (!id)
                return;
            try {
                const { room } = await getRoomDetails(id);
                console.log("room details: ", room);
                setRoom(room);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch room details");
            }
            finally {
                setLoading(false);
            }
        };
        fetchRoomDetails();
    }, [id]);
    if (loading)
        return _jsx("p", { className: "text-center p-6", children: "Loading room details..." });
    if (error)
        return _jsx("p", { className: "text-red-500 text-center p-6", children: error });
    if (!room)
        return _jsx("p", { className: "text-center p-6", children: "No room found" });
    return (_jsxs("div", { className: "room-details-container p-6 max-w-4xl mx-auto", children: [_jsx("button", { onClick: () => navigate("/admin/rooms"), className: "mb-6 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400", children: "Back to Room List" }), _jsxs("h1", { className: "text-2xl font-bold text-gray-800 mb-6", children: ["Room Details: ", room.title] }), _jsxs("div", { className: "bg-white shadow-md rounded-lg p-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-6", children: [_jsxs("div", { children: [_jsxs("p", { children: [_jsx("strong", { children: "Title:" }), " ", room.title] }), _jsxs("p", { children: [_jsx("strong", { children: "Type:" }), " ", room.type] }), _jsxs("p", { children: [_jsx("strong", { children: "Limit:" }), " ", room.limit] }), _jsxs("p", { children: [_jsx("strong", { children: "Premium:" }), " ", room.premium ? "Yes" : "No"] }), _jsxs("p", { children: [_jsx("strong", { children: "Description:" }), " ", room.description] })] }), _jsxs("div", { children: [_jsxs("p", { children: [_jsx("strong", { children: "Created By:" }), " ", room.createdBy.name, " (", room.createdBy.email, ")"] }), _jsxs("p", { children: [_jsx("strong", { children: "Created At:" }), " ", new Date(room.createdAt).toLocaleString()] }), _jsxs("p", { children: [_jsx("strong", { children: "Status:" }), " ", room.isBlocked ? "Blocked" : "Active"] }), _jsxs("p", { children: [_jsx("strong", { children: "Secret Code:" }), " ", room.secretCode || "N/A"] })] })] }), _jsx("h2", { className: "text-xl font-semibold text-gray-700 mb-4", children: "Participants" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full bg-white rounded-lg shadow-md", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-gray-200", children: [_jsx("th", { className: "px-4 py-3 text-left text-sm font-semibold", children: "Name" }), _jsx("th", { className: "px-4 py-3 text-left text-sm font-semibold", children: "Email" }), _jsx("th", { className: "px-4 py-3 text-left text-sm font-semibold", children: "First Join" }), _jsx("th", { className: "px-4 py-3 text-left text-sm font-semibold", children: "Last Join" }), _jsx("th", { className: "px-4 py-3 text-left text-sm font-semibold", children: "Last Leave" }), _jsx("th", { className: "px-4 py-3 text-left text-sm font-semibold", children: "Total Duration (min)" })] }) }), _jsx("tbody", { children: room.participants.length > 0 ? (room.participants.map((participant, index) => (_jsxs("tr", { className: "border-b last:border-0 hover:bg-gray-50", children: [_jsx("td", { className: "px-4 py-3", children: participant.userId.name }), _jsx("td", { className: "px-4 py-3", children: participant.userId.email }), _jsx("td", { className: "px-4 py-3", children: new Date(participant.firstJoin).toLocaleString() }), _jsx("td", { className: "px-4 py-3", children: new Date(participant.lastJoin).toLocaleString() }), _jsx("td", { className: "px-4 py-3", children: participant.lastLeave ? new Date(participant.lastLeave).toLocaleString() : "N/A" }), _jsx("td", { className: "px-4 py-3", children: Math.round(participant.totalDuration / 60000) })] }, index)))) : (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "text-center py-4 text-gray-500", children: "No participants found" }) })) })] }) })] })] }));
}
