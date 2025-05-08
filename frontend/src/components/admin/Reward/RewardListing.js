import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Search, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { fetchRewards, deleteReward } from "@/services/AdminRewardService";
import { useDebounce } from "@/hooks/useDebounce";
const AdminRewardsList = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 1000);
    const [page, setPage] = useState(1);
    const limit = 4;
    const [data, setData] = useState({ rewards: [], total: 0 });
    const [isPending, setIsPending] = useState(false);
    const [isError, setIsError] = useState(false);
    const loadRewards = async () => {
        try {
            setIsPending(true);
            const fetchedData = await fetchRewards(page, limit, debouncedSearchTerm);
            setData(fetchedData);
        }
        catch (error) {
            if (error instanceof Error) {
                setIsError(true);
                console.log('Caught error:', error.message);
            }
            else {
                setIsError(true);
                console.log('Unknown error:', error);
            }
        }
        finally {
            setIsPending(false);
        }
    };
    useEffect(() => {
        loadRewards();
    }, [page, debouncedSearchTerm]);
    const handleDelete = (rewardId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This reward will be deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteReward(rewardId); // Use deleteReward service
                    Swal.fire("Deleted!", "Reward has been deleted.", "success");
                    loadRewards(); // Reload rewards after deletion
                }
                catch (error) {
                    if (error instanceof Error) {
                        Swal.fire(error.message);
                        console.log('Caught error:', error.message);
                    }
                    else {
                        Swal.fire("Error!", "Failed to delete reward.", "error");
                        console.log('Unknown error:', error);
                    }
                }
            }
        });
    };
    if (isPending)
        return _jsx("div", { className: "text-center py-12", children: "Loading rewards..." });
    if (isError)
        return _jsx("div", { className: "text-center py-12 text-red-500", children: "Failed to load rewards." });
    const totalPages = Math.ceil(data.total / limit);
    return (_jsx("div", { className: "customer-dashboard flex-1", children: _jsx("div", { className: "grid-layout", children: _jsxs("div", { children: [_jsxs("div", { className: "mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center", children: [_jsxs("div", { className: "search-container", children: [_jsx("input", { type: "text", placeholder: "Search rewards...", className: "search-input", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) }), _jsx(Search, { className: "absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-orange-500" })] }), _jsx("button", { className: "bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700", onClick: () => navigate("/admin/rewards/add"), children: "Add New Reward" })] }), _jsx("div", { className: "table-container !text-dark", children: _jsxs("table", { className: "w-full !text-black", children: [_jsx("thead", { children: _jsxs("tr", { className: "table-header", children: [_jsx("th", { className: "rounded-tl-lg px-4 py-3 text-left text-sm", children: "S. No" }), _jsx("th", { className: "px-4 py-3 text-left text-sm", children: "Title" }), _jsx("th", { className: "px-4 py-3 text-left text-sm", children: "Type" }), _jsx("th", { className: "px-4 py-3 text-left text-sm", children: "Value" }), _jsx("th", { className: "px-4 py-3 text-left text-sm", children: "Points" }), _jsx("th", { className: "px-4 py-3 text-left text-sm", children: "Streak" }), _jsx("th", { className: "rounded-tr-lg px-4 py-3 text-left text-sm", children: "Actions" })] }) }), _jsx("tbody", { children: data.rewards.length > 0 ? (data.rewards.map((reward, index) => (_jsxs("tr", { className: "table-row border-b border-gray-100 last:border-0", children: [_jsx("td", { className: "px-4 py-3", children: _jsx("span", { className: "font-bold", children: (page - 1) * limit + index + 1 }) }), _jsx("td", { className: "px-4 py-3", children: reward.title }), _jsx("td", { className: "px-4 py-3", children: reward.type }), _jsx("td", { className: "px-4 py-3", children: reward.value }), _jsx("td", { className: "px-4 py-3", children: reward.requiredPoints || "-" }), _jsx("td", { className: "px-4 py-3", children: reward.requiredStreak || "-" }), _jsx("td", { className: "px-4 py-3", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { className: "action-button edit-button", onClick: () => navigate(`/admin/rewards/edit/${reward.rewardId}`), children: _jsx(Edit, { className: "h-5 w-5" }) }), _jsx("button", { className: "action-button delete-button", onClick: () => handleDelete(reward.rewardId), children: _jsx(Trash2, { className: "h-5 w-5" }) })] }) })] }, reward.rewardId)))) : (_jsx("tr", { children: _jsx("td", { colSpan: 7, className: "text-center py-4 text-gray-500", children: "No rewards found" }) })) })] }) }), _jsxs("div", { className: "pagination", children: [_jsx("button", { disabled: page === 1, onClick: () => setPage((prev) => prev - 1), className: "page-button", children: _jsx(ChevronLeft, { className: "h-4 w-4" }) }), _jsx("span", { className: "px-3 py-2", children: page }), _jsx("button", { disabled: page >= totalPages, onClick: () => setPage((prev) => prev + 1), className: "page-button", children: _jsx(ChevronRight, { className: "h-4 w-4" }) })] })] }) }) }));
};
export default AdminRewardsList;
