import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTriviaQuestionById, useUpdateTriviaQuestion } from "@/hooks/useAdminTrivia";
import "./adminTriviaForm.css"; // Reuse the same styles
import toast from "react-hot-toast";
const AdminTriviaEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: trivia, isLoading: isFetching } = useTriviaQuestionById(id || "");
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", "", "", ""]);
    const [correctAnswer, setCorrectAnswer] = useState("");
    const { mutate: updateTrivia, isLoading: isUpdating } = useUpdateTriviaQuestion();
    // Pre-fill form when data loads
    React.useEffect(() => {
        if (trivia) {
            setQuestion(trivia.question);
            setOptions(trivia.options);
            setCorrectAnswer(trivia.correctAnswer);
        }
    }, [trivia]);
    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!id)
            return;
        const triviaData = { question, options, correctAnswer };
        updateTrivia({ id, data: triviaData }, {
            onSuccess: () => {
                alert("Trivia question updated successfully!");
                navigate("/trivia"); // Redirect to list after update
            },
            onError: () => toast(`Failed to update trivia question`),
        });
    };
    if (isFetching)
        return _jsx("div", { children: "Loading trivia question..." });
    return (_jsx("div", { className: "form-container w-150", children: _jsxs("div", { className: "form-card", children: [_jsx("h2", { className: "form-heading", children: "Edit Trivia Question" }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "question", className: "form-label", children: "Question" }), _jsx("input", { type: "text", id: "question", value: question, onChange: (e) => setQuestion(e.target.value), className: "form-input", placeholder: "Enter trivia question", required: true })] }), options.map((option, index) => (_jsxs("div", { className: "form-group", children: [_jsxs("label", { htmlFor: `option${index}`, className: "form-label", children: ["Option ", index + 1] }), _jsx("input", { type: "text", id: `option${index}`, value: option, onChange: (e) => handleOptionChange(index, e.target.value), className: "form-input", placeholder: `Enter option ${index + 1}`, required: true })] }, index))), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "correctAnswer", className: "form-label", children: "Correct Answer" }), _jsxs("select", { id: "correctAnswer", value: correctAnswer, onChange: (e) => setCorrectAnswer(e.target.value), className: "form-select", required: true, children: [_jsx("option", { value: "", children: "Select correct answer" }), options.map((opt, index) => (_jsx("option", { value: opt, disabled: !opt, children: opt || "Fill option first" }, index)))] })] }), _jsx("button", { type: "submit", className: "form-button", disabled: isUpdating, children: isUpdating ? "Updating..." : "Update Trivia Question" })] })] }) }));
};
export default AdminTriviaEdit;
