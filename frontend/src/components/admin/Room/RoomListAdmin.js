"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Search, ChevronDown, BarChart2, ScanSearch, ChevronRight, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRooms, useBlockRoom, useUnblockRoom } from "../../../hooks/useRooms";
import Swal from "sweetalert2";
export default function RoomlistAdmin() {
    const [page, setPage] = useState(1);
    const limit = 6;
    const navigate = useNavigate();
    const blockMutation = useBlockRoom();
    const unblockMutation = useUnblockRoom();
    // const deleteMutation = useDeleteRoom()
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('all');
    const { data, isLoading, isError } = useRooms(page, limit, searchTerm, sortOption);
    console.log("data from component ", data);
    const rooms = data?.rooms ?? [];
    const totalRooms = data?.totalRooms ?? 0;
    const totalPages = Math.ceil(totalRooms / limit);
    console.log("totalCount", totalPages);
    const handleBlock = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you really want to block this user?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, Block",
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.isConfirmed) {
                blockMutation.mutate(id, {
                    onSuccess: () => {
                        Swal.fire("Blocked!", "The user has been blocked.", "success");
                    },
                    onError: () => {
                        Swal.fire("Error!", "Something went wrong.", "error");
                    },
                });
            }
        });
    };
    const handleUnblock = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to unblock this user?",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#28a745",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, Unblock",
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.isConfirmed) {
                unblockMutation.mutate(id, {
                    onSuccess: () => {
                        Swal.fire("Unblocked!", "The user has been unblocked.", "success");
                    },
                    onError: () => {
                        Swal.fire("Error!", "Something went wrong.", "error");
                    },
                });
            }
        });
    };
    const handleViewDetails = (id) => {
        navigate(`/admin/room-details/${id}`);
    };
    // const handleDelete = (id: string) => {
    //   Swal.fire({
    //     title: "Are you sure?",
    //     text: "You won't be able to revert this!",
    //     icon: "warning",
    //     showCancelButton: true,
    //     confirmButtonColor: "#d33",
    //     cancelButtonColor: "#3085d6",
    //     confirmButtonText: "Yes, delete it!",
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       deleteMutation.mutate(id, {
    //         onSuccess: () => {
    //           Swal.fire("Deleted!", "The user has been deleted.", "success");
    //         },
    //         onError: () => {
    //           Swal.fire("Error!", "Something went wrong.", "error");
    //         },
    //       });
    //     }
    //   });
    // };
    if (isLoading)
        return _jsx("p", { children: "Loading Rooms..." });
    if (isError)
        return _jsx("p", { children: "Error fetching Rooms.." });
    return (_jsx("div", { className: "customer-dashboard flex-1", children: _jsx("div", { className: "grid-layout", children: _jsxs("div", { children: [_jsxs("div", { className: "mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center", children: [_jsxs("div", { className: "search-container text-black", children: [_jsx("input", { type: "text", placeholder: "Search users here", className: "search-input !text-black ", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) }), _jsx(Search, { className: "absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-orange-500" })] }), _jsxs("div", { className: "sort-options", children: [_jsxs("div", { className: "sort-item", children: [_jsx(BarChart2, { className: "h-5 w-5 text-orange-500" }), _jsx("span", { children: "Sort By" })] }), _jsx("div", { className: "sort-item", children: _jsxs("select", { className: "outline-none", value: sortOption, onChange: (e) => setSortOption(e.target.value), children: [_jsx(ChevronDown, { className: "h-4 w-4" }), _jsx("option", { className: "text-black", value: "all", children: "ALL" }), _jsx("option", { className: "text-black", value: "public", children: "PUBLIC" }), _jsx("option", { className: "text-black ", value: "private", children: "PRIVATE" })] }) })] })] }), _jsx("div", { className: "table-container", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "table-header", children: [_jsx("th", { className: "rounded-tl-lg px-4 py-3 text-left text-sm", children: "S. Number" }), _jsx("th", { className: "px-4 py-3 text-left text-sm", children: "Name" }), _jsx("th", { className: "px-4 py-3 text-left text-sm", children: "createdBy" }), _jsx("th", { className: "px-4 py-3 text-left text-sm", children: "Type" }), _jsx("th", { className: "px-4 py-3 text-left text-sm", children: "Limit" }), _jsx("th", { className: "px-4 py-3 text-left text-sm", children: "Live" }), _jsx("th", { className: "px-4 py-3 text-left text-sm", children: "Status" }), _jsx("th", { className: "rounded-tr-lg px-4 py-3 text-left text-sm", children: "Update" })] }) }), _jsx("tbody", { children: rooms?.length > 0 ? (rooms?.map((room, index) => (_jsxs("tr", { className: "table-row border-b border-gray-100 last:border-0", children: [_jsx("td", { className: "px-4 py-3", children: _jsx("span", { className: "font-bold", children: index + 1 }) }), _jsx("td", { className: "px-4 py-3", children: room.title }), _jsx("td", { className: "px-4 py-3", children: room.createdBy?.name || "Unknown" }), _jsx("td", { className: "px-4 py-3", children: room.type }), _jsx("td", { className: "px-4 py-3", children: room.limit }), _jsx("td", { className: "px-4 py-3", children: room.participants.length }), _jsx("td", { className: "px-4 py-3", children: room.isBlocked ? (_jsx("button", { onClick: () => handleUnblock(room._id), className: "status-button status-unblocked bg-green-500 text-white px-2 py-1 rounded", children: "Unblock" })) : (_jsx("button", { onClick: () => handleBlock(room._id), className: "status-button status-blocked bg-red-500 text-white px-2 py-1 rounded", children: "Block" })) }), _jsx("td", { className: "px-4 py-3", children: _jsx("button", { onClick: () => handleViewDetails(room._id), className: "action-button delete-button", children: _jsx(ScanSearch, { className: "h-5 w-5" }) }) })] }, room._id)))) : (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "text-center py-4 text-gray-500", children: "No users found" }) })) })] }) }), _jsxs("div", { className: "pagination", children: [_jsx("button", { disabled: page === 1, onClick: () => setPage((prev) => prev - 1), className: "page-button", children: _jsx(ChevronLeft, { className: "h-4 w-4" }) }), _jsx("span", { className: "px-3 py-2", children: page }), _jsx("button", { disabled: page >= totalPages, onClick: () => setPage((prev) => prev + 1), className: "page-button", children: _jsx(ChevronRight, { className: "h-4 w-4" }) })] })] }) }) }));
}
