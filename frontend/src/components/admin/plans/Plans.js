import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Search, Package, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import './plans.css';
import { usePlans } from "../../../hooks/useAdminPlans";
import { useDeletePlan } from "../../../hooks/useDeletePlan";
import Swal from "sweetalert2";
import { ChevronDown, BarChart2, ChevronRight, ChevronLeft } from 'lucide-react';
import { useAppSelector } from "../../../redux/store";
export default function SubscriptionPlans() {
    const navigate = useNavigate();
    const { isAuthenticated, accessToken } = useAppSelector((state) => state.user);
    console.log("Admin state redux ", isAuthenticated, accessToken);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('A-Z');
    const [page, setPage] = useState(1);
    const limit = 4;
    const { data = { plans: [], total: 0 }, isLoading, isError } = usePlans(page, limit, searchTerm, sortOption);
    console.log(data);
    const totalPages = Math.ceil(data.total / limit);
    const { mutate } = useDeletePlan();
    console.log("plans: ", data.plans);
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This plan will be deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                mutate(id);
                Swal.fire("Deleted!", "Plan has been deleted.", "success");
            }
        });
    };
    if (isLoading)
        return _jsx("div", { className: "text-center py-12", children: "Loading plans..." });
    if (isError)
        return _jsx("div", { className: "text-center py-12 text-red-500", children: "Failed to load plans." });
    return (_jsxs("div", { className: "subscription-plans flex-1", children: [_jsxs("div", { className: "mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center", children: [_jsxs("div", { className: "search-container", children: [_jsx("input", { type: "text", placeholder: "Search plans here", className: "search-input", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) }), _jsx(Search, { className: "absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-orange-500" })] }), _jsxs("div", { className: "sort-options", children: [_jsxs("div", { className: "sort-item", children: [_jsx(BarChart2, { className: "h-5 w-5 text-orange-500" }), _jsx("span", { children: "Sort By" })] }), _jsx("div", { className: "sort-item", children: _jsxs("select", { className: "outline-none", value: sortOption, onChange: (e) => setSortOption(e.target.value), children: [_jsx(ChevronDown, { className: "h-4 w-4" }), _jsx("option", { className: "text-black", value: "A-Z", children: "A-Z" }), _jsx("option", { className: "text-black ", value: "Z-A", children: "Z-A" }), _jsx("option", { className: "text-black ", value: "saleLowHigh", children: "Sale Amount (Low-High)" }), _jsx("option", { className: "text-black ", value: "saleHighLow", children: "Sale Amount (High-Low)" })] }) })] }), _jsxs("button", { className: "add-plan-button", onClick: () => navigate('/plans/add'), children: [_jsx(Package, { className: "h-4 w-4 mr-1" }), _jsx("span", { children: "Add New Plan" })] })] }), _jsx("div", { className: "table-container", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "table-header", children: [_jsx("th", { className: "rounded-tl-lg px-4 py-3 text-left text-sm", children: "S. Number" }), _jsx("th", { className: "px-4 py-3 text-left text-sm", children: "Name" }), _jsx("th", { className: "px-4 py-3 text-left text-sm", children: "Amount" }), _jsx("th", { className: "px-4 py-3 text-left text-sm", children: "Sale Amount" }), _jsx("th", { className: "px-4 py-3 text-left text-sm", children: "Benefits" }), _jsx("th", { className: "px-4 py-3 text-left text-sm", children: "ACTIVE" }), _jsx("th", { className: "rounded-tr-lg px-4 py-3 text-left text-sm", children: "Update" })] }) }), _jsx("tbody", { children: data.plans.map((plan, index) => (_jsxs("tr", { className: "table-row border-b border-gray-100 last:border-0", children: [_jsx("td", { className: "px-4 py-3 font-bold", children: index + 1 }), _jsx("td", { className: "px-4 py-3", children: plan.name }), _jsx("td", { className: "px-4 py-3", children: plan.regularAmount }), _jsx("td", { className: "px-4 py-3", children: plan.discountAmount }), _jsx("td", { className: "px-4 py-3", children: _jsx("div", { className: "h-24 overflow-y-auto pr-2 custom-scrollbar", children: _jsx("ol", { className: "list-decimal pl-5 text-sm", children: plan.benefits.map((benefit, index) => (_jsx("li", { className: "mb-1", children: benefit }, index))) }) }) }), _jsx("td", { className: "px-4 py-3", children: _jsx("button", { className: `status-button ${plan.isListed ? "status-active" : "status-inactive"}`, children: plan.isListed ? "TRUE" : "FALSE" }) }), _jsx("td", { className: "px-4 py-3", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { className: "action-button edit-button", onClick: () => navigate(`/plans/edit/${plan._id}`), children: _jsx(Edit, { className: "h-5 w-5" }) }), _jsx("button", { onClick: () => handleDelete(plan._id), className: "action-button delete-button", children: _jsx(Trash2, { className: "h-5 w-5" }) })] }) })] }, plan._id))) })] }) }), data.plans.length === 0 && (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-gray-500 text-lg", children: "No plans found. Try adjusting your search or add a new plan." }) })), _jsxs("div", { className: "pagination", children: [_jsx("button", { disabled: page === 1, onClick: () => setPage((prev) => prev - 1), className: "page-button", children: _jsx(ChevronLeft, { className: "h-4 w-4" }) }), _jsx("span", { className: "px-3 py-2", children: page }), _jsx("button", { disabled: page >= totalPages, onClick: () => setPage((prev) => prev + 1), className: "page-button", children: _jsx(ChevronRight, { className: "h-4 w-4" }) })] })] }));
}
