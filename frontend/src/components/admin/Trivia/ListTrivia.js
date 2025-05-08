import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Search, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDeleteTriviaQuestion, useTriviaQuestion } from "@/hooks/useAdminTrivia";
import Swal from "sweetalert2";
import { ChevronRight, ChevronLeft } from "lucide-react";
import "./triviaList.css";
export default function ListTrivia() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const limit = 4;
    const { data = { questions: [], total: 0 }, isLoading, isError } = useTriviaQuestion(page, limit, searchTerm);
    const totalPages = Math.ceil(data.total / limit);
    const { mutate: deleteTrivia } = useDeleteTriviaQuestion();
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This trivia question will be deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteTrivia(id, {
                    onSuccess: () => Swal.fire("Deleted!", "Trivia question has been deleted.", "success"),
                });
            }
        });
    };
    if (isLoading)
        return _jsx("div", { className: "text-center py-12", children: "Loading trivia questions..." });
    if (isError)
        return _jsx("div", { className: "text-center py-12 text-red-500", children: "Failed to load trivia questions." });
    return (_jsxs("div", { className: "trivia-list flex-1", children: [_jsxs("div", { className: "mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center", children: [_jsxs("div", { className: "search-container", children: [_jsx("input", { type: "text", placeholder: "Search trivia questions here", className: "search-input", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) }), _jsx(Search, { className: "absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-orange-500" })] }), _jsx("button", { className: "add-plan-button", onClick: () => navigate("/trivia/add"), children: _jsx("span", { children: "Add New Trivia" }) })] }), _jsx("div", { className: "table-container", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "table-header", children: [_jsx("th", { className: "rounded-tl-lg px-4 py-3 text-left text-sm", children: "S. No" }), _jsx("th", { className: "px-4 py-3 text-left text-sm", children: "Set Number" }), _jsx("th", { className: "px-4 py-3 text-left text-sm", children: "Question" }), _jsx("th", { className: "px-4 py-3 text-left text-sm", children: "Correct Answer" }), _jsx("th", { className: "rounded-tr-lg px-4 py-3 text-left text-sm", children: "Actions" })] }) }), _jsx("tbody", { children: data.questions.map((trivia, index) => (_jsxs("tr", { className: "table-row border-b border-gray-100 last:border-0", children: [_jsx("td", { className: "px-4 py-3 font-bold", children: (page - 1) * limit + index + 1 }), _jsx("td", { className: "px-4 py-3", children: trivia.setNumber }), _jsx("td", { className: "px-4 py-3", children: trivia.question }), _jsx("td", { className: "px-4 py-3", children: trivia.correctAnswer }), _jsx("td", { className: "px-4 py-3", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { className: "action-button edit-button", onClick: () => navigate(`/admin/trivia/edit/${trivia._id}`), children: _jsx(Edit, { className: "h-5 w-5" }) }), _jsx("button", { className: "action-button delete-button", onClick: () => handleDelete(trivia._id), children: _jsx(Trash2, { className: "h-5 w-5" }) })] }) })] }, trivia._id))) })] }) }), data.questions.length === 0 && (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-gray-500 text-lg", children: "No trivia questions found. Try adjusting your search or add a new question." }) })), _jsxs("div", { className: "pagination", children: [_jsx("button", { disabled: page === 1, onClick: () => setPage((prev) => prev - 1), className: "page-button", children: _jsx(ChevronLeft, { className: "h-4 w-4" }) }), _jsx("span", { className: "px-3 py-2", children: page }), _jsx("button", { disabled: page >= totalPages, onClick: () => setPage((prev) => prev + 1), className: "page-button", children: _jsx(ChevronRight, { className: "h-4 w-4" }) })] })] }));
}
