

import React, { useState } from "react";
import { useAddTriviaQuestion } from "@/hooks/useAdminTrivia";
import "./adminTriviaForm.css"; 
import { validateTriviaForm ,FormErrors} from "@/utils/validations/AdminTriviaValidations";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AdminTriviaForm: React.FC = () => {
  const navigate = useNavigate()
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [errors,setErrors] = useState<FormErrors>({})
  const { mutate: addTrivia, isLoading } = useAddTriviaQuestion();

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateTriviaForm(question, options, correctAnswer);
    setErrors(validationErrors);
    if(Object.keys(validationErrors).length ===0){
      const triviaData = {
        question,
        options,
        correctAnswer,
      };
      addTrivia(triviaData, {
        onSuccess: () => {
          toast("Trivia question added successfully!",{duration:2000});
          setQuestion("");
          setOptions(["", "", "", ""]);
          setCorrectAnswer("");
          setTimeout(() => {
            navigate('/trivia')
          },2000)
        },
        onError: () => toast(`Failed to add trivia question`),
      });
    }
    
  };

  return (
    <div className="form-container w-150">
      <div className="form-card">
        <h2 className="form-heading">Add Daily Trivia Question</h2>
        <form onSubmit={handleSubmit}>
          {/* Question */}
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
            />
            {errors.question && <span className="form-error">{errors.question}</span>}
          </div>
          {/* Options */}
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
              />
              {errors.options && errors.options[index] && (
                <span className="form-error">{errors.options[index]}</span>
              )}
            </div>
          ))}

          {/* Correct Answer */}
          <div className="form-group">
            <label htmlFor="correctAnswer" className="form-label">
              Correct Answer
            </label>
            <select
              id="correctAnswer"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              className="form-select"
            >
              <option value="">Select correct answer</option>
              {options.map((opt, index) => (
                <option key={index} value={opt} disabled={!opt}>
                  {opt || "Fill option first"}
                </option>
              ))}
            </select>
            {errors.correctAnswer && (
              <span className="form-error">{errors.correctAnswer}</span>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="form-button" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Trivia Question"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminTriviaForm;