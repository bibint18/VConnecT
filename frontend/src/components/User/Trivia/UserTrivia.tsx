import React, { useState, useEffect } from "react";
import { fetchDailyTriviaQuestions, ITrivia, submitTriviaAnswer } from "@/services/TriviaService";
import toast from "react-hot-toast";
import "./userTrivia.css";

interface Attempt {
  triviaId: string;
  selectedAnswer: string;
  isCorrect: boolean;
}

const UserTrivia: React.FC = () => {
  const [questions, setQuestions] = useState<ITrivia[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [points,setPoints] = useState<number>(0)
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        const {questions,point} = await fetchDailyTriviaQuestions();
        setQuestions(questions);
        setPoints(point)
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred while fetching trivia questions");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const handleAnswerClick = async (triviaId: string, selectedAnswer: string) => {
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
        setPoints((prev) => prev +1)
      } else {
        toast.error("Incorrect Answer");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message === "Question already attempted") {
          toast.error("Already Attempted");
          setAttempts((prev) => [
            ...prev,
            { triviaId, selectedAnswer, isCorrect: false },
          ]);
        } else {
          toast.error(err.message);
        }
      } else {
        toast.error("An unexpected error occurred while submitting answer");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="loading">Loading trivia questions...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="user-trivia">
      {/* <div className="trivia-header">
        <div className="decorative-design"></div>
      </div> */}
      {/* <div className="points-display">Points: {points}</div> */}

      <div className="trivia-header">
      <h1 className="trivia-title">Daily Trivia</h1>
      <div className="points-display">
        <span className="points-icon">★</span>
        <span>Points: {points}</span>
      </div>
    </div>
      {questions.length === 0 ? (
        <p className="no-questions">No trivia questions available today. Check back tomorrow!</p>
      ) : (
        <div className="trivia-boxes-row">
          {questions.map((trivia) => {
            const attempt = attempts.find((a) => a.triviaId === trivia._id);
            return (
              <div key={trivia._id} className="trivia-box">
                <div className="question-box">
                  <p>{trivia.question}</p>
                </div>
                <div className="options-grid">
                  {trivia.options.map((option, index) => {
                    const labels = ["A.", "B.", "C.", "D."];
                    const isSelected = attempt?.selectedAnswer === option;
                    const className = isSelected
                      ? attempt.isCorrect
                        ? "option correct"
                        : "option incorrect"
                      : "option";
                    return (
                      <button
                        key={index}
                        className={className}
                        onClick={() => handleAnswerClick(trivia._id, option)}
                        disabled={!!attempt || isSubmitting}
                      >
                        {labels[index]} {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserTrivia;