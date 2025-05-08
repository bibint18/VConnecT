import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { fetchDailyTriviaQuestions, submitTriviaAnswer } from "@/services/TriviaService";
import toast from "react-hot-toast";
import "./userTrivia.css";
const UserTrivia = () => {
    const [questions, setQuestions] = useState([]);
    const [attempts, setAttempts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [points, setPoints] = useState(0);
    useEffect(() => {
        const loadQuestions = async () => {
            try {
                setIsLoading(true);
                const { questions, point } = await fetchDailyTriviaQuestions();
                setQuestions(questions);
                setPoints(point);
            }
            catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                }
                else {
                    setError("An unexpected error occurred while fetching trivia questions");
                }
            }
            finally {
                setIsLoading(false);
            }
        };
        loadQuestions();
    }, []);
    const handleAnswerClick = async (triviaId, selectedAnswer) => {
        const existingAttempt = attempts.find((a) => a.triviaId === triviaId);
        if (existingAttempt) {
            toast.error("Already Attempted");
            return;
        }
        setIsSubmitting(true);
        try {
            const result = await submitTriviaAnswer(triviaId, selectedAnswer);
            setAttempts((prev) => [
                ...prev,
                { triviaId, selectedAnswer, isCorrect: result.isCorrect },
            ]);
            if (result.isCorrect) {
                toast.success("Correct Answer");
                setPoints((prev) => prev + 1);
            }
            else {
                toast.error("Incorrect Answer");
            }
        }
        catch (err) {
            if (err instanceof Error) {
                if (err.message === "Question already attempted") {
                    toast.error("Already Attempted");
                    setAttempts((prev) => [
                        ...prev,
                        { triviaId, selectedAnswer, isCorrect: false },
                    ]);
                }
                else {
                    toast.error(err.message);
                }
            }
            else {
                toast.error("An unexpected error occurred while submitting answer");
            }
        }
        finally {
            setIsSubmitting(false);
        }
    };
    if (isLoading)
        return _jsx("div", { className: "loading", children: "Loading trivia questions..." });
    if (error)
        return _jsx("div", { className: "error", children: error });
    return (_jsxs("div", { className: "user-trivia", children: [_jsxs("div", { className: "trivia-header", children: [_jsx("h1", { className: "trivia-title", children: "Daily Trivia" }), _jsxs("div", { className: "points-display", children: [_jsx("span", { className: "points-icon", children: "\u2605" }), _jsxs("span", { children: ["Points: ", points] })] })] }), questions.length === 0 ? (_jsx("p", { className: "no-questions", children: "No trivia questions available today. Check back tomorrow!" })) : (_jsx("div", { className: "trivia-boxes-row", children: questions.map((trivia) => {
                    const attempt = attempts.find((a) => a.triviaId === trivia._id);
                    return (_jsxs("div", { className: "trivia-box", children: [_jsx("div", { className: "question-box", children: _jsx("p", { children: trivia.question }) }), _jsx("div", { className: "options-grid", children: trivia.options.map((option, index) => {
                                    const labels = ["A.", "B.", "C.", "D."];
                                    const isSelected = attempt?.selectedAnswer === option;
                                    const className = isSelected
                                        ? attempt.isCorrect
                                            ? "option correct"
                                            : "option incorrect"
                                        : "option";
                                    return (_jsxs("button", { className: className, onClick: () => handleAnswerClick(trivia._id, option), disabled: !!attempt || isSubmitting, children: [labels[index], " ", option] }, index));
                                }) })] }, trivia._id));
                }) }))] }));
};
export default UserTrivia;
