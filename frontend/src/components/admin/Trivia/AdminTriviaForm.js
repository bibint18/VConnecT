import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useAddTriviaQuestion } from "@/hooks/useAdminTrivia";
import "./adminTriviaForm.css";
import { validateTriviaForm } from "@/utils/validations/AdminTriviaValidations";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const AdminTriviaForm = () => {
    const navigate = useNavigate();
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", "", "", ""]);
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [errors, setErrors] = useState({});
    const { mutate: addTrivia, isLoading } = useAddTriviaQuestion();
    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateTriviaForm(question, options, correctAnswer);
        setErrors(validationErrors);
        // const triviaData = {
        //   question,
        //   options,
        //   correctAnswer,
        // };
        if (Object.keys(validationErrors).length === 0) {
            const triviaData = {
                question,
                options,
                correctAnswer,
            };
            addTrivia(triviaData, {
                onSuccess: () => {
                    toast("Trivia question added successfully!", { duration: 2000 });
                    setQuestion("");
                    setOptions(["", "", "", ""]);
                    setCorrectAnswer("");
                    setTimeout(() => {
                        navigate('/trivia');
                    }, 2000);
                },
                onError: () => toast(`Failed to add trivia question`),
            });
        }
    };
    return (_jsx("div", { className: "form-container w-150", children: _jsxs("div", { className: "form-card", children: [_jsx("h2", { className: "form-heading", children: "Add Daily Trivia Question" }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "question", className: "form-label", children: "Question" }), _jsx("input", { type: "text", id: "question", value: question, onChange: (e) => setQuestion(e.target.value), className: "form-input", placeholder: "Enter trivia question" }), errors.question && _jsx("span", { className: "form-error", children: errors.question })] }), options.map((option, index) => (_jsxs("div", { className: "form-group", children: [_jsxs("label", { htmlFor: `option${index}`, className: "form-label", children: ["Option ", index + 1] }), _jsx("input", { type: "text", id: `option${index}`, value: option, onChange: (e) => handleOptionChange(index, e.target.value), className: "form-input", placeholder: `Enter option ${index + 1}` }), errors.options && errors.options[index] && (_jsx("span", { className: "form-error", children: errors.options[index] }))] }, index))), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "correctAnswer", className: "form-label", children: "Correct Answer" }), _jsxs("select", { id: "correctAnswer", value: correctAnswer, onChange: (e) => setCorrectAnswer(e.target.value), className: "form-select", children: [_jsx("option", { value: "", children: "Select correct answer" }), options.map((opt, index) => (_jsx("option", { value: opt, disabled: !opt, children: opt || "Fill option first" }, index)))] }), errors.correctAnswer && (_jsx("span", { className: "form-error", children: errors.correctAnswer }))] }), _jsx("button", { type: "submit", className: "form-button", disabled: isLoading, children: isLoading ? "Adding..." : "Add Trivia Question" })] })] }) }));
};
export default AdminTriviaForm;
