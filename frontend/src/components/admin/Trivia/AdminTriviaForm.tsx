import React, { useState } from "react";
import { useAddTriviaQuestion } from "@/hooks/useAdminTrivia";

const AdminTriviaForm: React.FC = () => {
  const [question, setQuestion] = useState("");
  const [setNumber, setSetNumber] = useState<number>(1);
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  const { mutate: addTrivia, isPending } = useAddTriviaQuestion();

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const triviaData = {
      question,
      setNumber,
      options,
      correctAnswer,
    };
    addTrivia(triviaData, {
      onSuccess: () => {
        alert("Trivia question added successfully!");
        setQuestion("");
        setSetNumber(1);
        setOptions(["", "", "", ""]);
        setCorrectAnswer("");
      },
      onError: () => alert(`Failed to add trivia question`),
    });
  };

  return (
    <div>
      <h2>Add Daily Trivia Question</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Question:</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Set Number:</label>
          <input
            type="number"
            value={setNumber}
            onChange={(e) => setSetNumber(Number(e.target.value))}
            min="1"
            required
          />
        </div>
        {options.map((option, index) => (
          <div key={index}>
            <label>Option {index + 1}:</label>
            <input
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              required
            />
          </div>
        ))}
        <div>
          <label>Correct Answer:</label>
          <select
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
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
        <button type="submit" disabled={isPending}>
          {isPending ? "Adding..." : "Add Trivia Question"}
        </button>
      </form>
    </div>
  );
};

export default AdminTriviaForm;