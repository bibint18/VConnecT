import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTriviaQuestionById, useUpdateTriviaQuestion } from "@/hooks/useAdminTrivia";
import "./adminTriviaForm.css"; // Reuse the same styles
import toast from "react-hot-toast";

const AdminTriviaEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: trivia, isPending: isFetching } = useTriviaQuestionById(id || "");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const { mutate: updateTrivia, isPending: isUpdating } = useUpdateTriviaQuestion();

  // Pre-fill form when data loads
  React.useEffect(() => {
    if (trivia) {
      setQuestion(trivia.question);
      setOptions(trivia.options);
      setCorrectAnswer(trivia.correctAnswer);
    }
  }, [trivia]);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    const triviaData = { question, options, correctAnswer };
    updateTrivia(
      { id, data: triviaData },
      {
        onSuccess: () => {
          alert("Trivia question updated successfully!");
          navigate("/trivia"); // Redirect to list after update
        },
        onError: () => toast(`Failed to update trivia question`),
      }
    );
  };

  if (isFetching) return <div>Loading trivia question...</div>;

  return (
    <div className="form-container w-150">
      <div className="form-card">
        <h2 className="form-heading">Edit Trivia Question</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="question" className="form-label">
              Question
            </label>
            <input
              type="text"
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="form-input"
              placeholder="Enter trivia question"
              required
            />
          </div>

          {options.map((option, index) => (
            <div className="form-group" key={index}>
              <label htmlFor={`option${index}`} className="form-label">
                Option {index + 1}
              </label>
              <input
                type="text"
                id={`option${index}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="form-input"
                placeholder={`Enter option ${index + 1}`}
                required
              />
            </div>
          ))}

          <div className="form-group">
            <label htmlFor="correctAnswer" className="form-label">
              Correct Answer
            </label>
            <select
              id="correctAnswer"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              className="form-select"
              required
            >
              <option value="">Select correct answer</option>
              {options.map((opt, index) => (
                <option key={index} value={opt} disabled={!opt}>
                  {opt || "Fill option first"}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="form-button" disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Update Trivia Question"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminTriviaEdit;