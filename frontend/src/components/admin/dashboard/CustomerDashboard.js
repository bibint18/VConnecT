"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Search, BarChart2, Trash2, ChevronRight, ChevronLeft } from "lucide-react";
import './customerDashboard.css';
import { useUsers, useBlockUser, useDeleteUser, useUnblockUser } from "../../../hooks/useUsers";
import Swal from "sweetalert2";
export default function CustomerDashboard() {
    const [page, setPage] = useState(1);
    const limit = 6;
    const blockMutation = useBlockUser();
    const unblockMutation = useUnblockUser();
    const deleteMutation = useDeleteUser();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState("A-Z");
    const { data, isLoading, isError } = useUsers(page, limit, searchTerm, sortOption);
    console.log("data from component ", data);
    const users = data?.users ?? [];
    const totalUsers = data?.totalUsers ?? 0;
    const totalPages = Math.ceil(totalUsers / limit);
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
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutation.mutate(id, {
                    onSuccess: () => {
                        Swal.fire("Deleted!", "The user has been deleted.", "success");
                    },
                    onError: () => {
                        Swal.fire("Error!", "Something went wrong.", "error");
                    },
                });
            }
        });
    };
    const getActivePlanName = (plans) => {
        if (plans) {
            const activePlan = plans.find(plan => plan.status === "active");
            return activePlan ? activePlan.planName : "No Active Plan";
        }
    };
    if (isLoading)
        return _jsx("p", { children: "Loading users..." });
    if (isError)
        return _jsx("p", { children: "Error fetching users.." });
    return (_jsx("div", { className: "customer-dashboard flex-1", children: _jsx("div", { className: "grid-layout", children: _jsxs("div", { children: [_jsxs("div", { className: "mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center", children: [_jsxs("div", { className: "search-container", children: [_jsx("input", { type: "text", placeholder: "Search users here", className: "search-input", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) }), _jsx(Search, { className: "absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-orange-500" })] }), _jsxs("div", { className: "sort-options", children: [_jsxs("div", { className: "sort-item", children: [_jsx(BarChart2, { className: "h-5 w-5 text-orange-500" }), _jsx("span", { children: "Sort By" })] }), _jsx("div", { className: "sort-item", children: _jsxs("select", { className: "outline-none", value: sortOption, onChange: (e) => setSortOption(e.target.value), children: [_jsx("option", { className: "text-black", value: "A-Z", children: "A-Z" }), _jsx("option", { className: "text-black ", value: "Z-A", children: "Z-A" }), _jsx("option", { className: "text-black ", value: "recent", children: "Recently Joined" })] }) })] })] }), _jsx("div", { className: "table-container", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "table-header", children: [_jsx("th", { className: "rounded-tl-lg px-4 py-3 text-left text-sm", children: "S. Number" }), _jsx("th", { className: "px-4 py-3 text-left text-sm", children: "Name" }), _jsx("th", { className: "px-4 py-3 text-left text-sm", children: "Email" }), _jsx("th", { className: "px-4 py-3 text-left text-sm", children: "Plan" }), _jsx("th", { className: "px-4 py-3 text-left text-sm", children: "Status" }), _jsx("th", { className: "rounded-tr-lg px-4 py-3 text-left text-sm", children: "Update" })] }) }), _jsx("tbody", { children: users?.length > 0 ? (users?.map((user, index) => (_jsxs("tr", { className: "table-row border-b border-gray-100 last:border-0", children: [_jsx("td", { className: "px-4 py-3", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "h-8 w-8 overflow-hidden rounded-full" }), _jsx("span", { className: "font-bold", children: index + 1 })] }) }), _jsx("td", { className: "px-4 py-3", children: user.name }), _jsx("td", { className: "px-4 py-3", children: user.email }), _jsx("td", { className: "px-4 py-3", children: getActivePlanName(user.plan) }), _jsx("td", { className: "px-4 py-3", children: user.isBlocked ? (_jsx("button", { onClick: () => handleUnblock(user._id), className: "status-button status-blocked", children: "Unblock" })) : (_jsx("button", { onClick: () => handleBlock(user._id), className: "status-button status-unblocked", children: "Block" })) }), _jsx("td", { className: "px-4 py-3", children: _jsx("div", { className: "flex items-center gap-2", children: _jsx("button", { onClick: () => handleDelete(user._id), className: "action-button delete-button", children: _jsx(Trash2, { className: "h-5 w-5" }) }) }) })] }, user._id)))) : (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "text-center py-4 text-gray-500", children: "No users found" }) })) })] }) }), _jsxs("div", { className: "pagination", children: [_jsx("button", { disabled: page === 1, onClick: () => setPage((prev) => prev - 1), className: "page-button", children: _jsx(ChevronLeft, { className: "h-4 w-4" }) }), _jsx("span", { className: "px-3 py-2", children: page }), _jsx("button", { disabled: page >= totalPages, onClick: () => setPage((prev) => prev + 1), className: "page-button", children: _jsx(ChevronRight, { className: "h-4 w-4" }) })] })] }) }) }));
}
