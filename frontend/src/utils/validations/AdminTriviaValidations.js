export const validateTriviaForm = (question, options, correctAnswer) => {
    const errors = {};
    // Validate question
    if (!question.trim()) {
        errors.question = "Question is required";
    }
    // Validate options
    const optionErrors = Array(4).fill("");
    options.forEach((option, index) => {
        if (!option.trim()) {
            optionErrors[index] = `Option ${index + 1} is required`;
        }
    });
    // Check for duplicate options
    const uniqueOptions = new Set(options.map(opt => opt.trim()));
    if (uniqueOptions.size !== options.length) {
        errors.options = optionErrors.length ? optionErrors : Array(4).fill("");
        errors.options[0] = "All options must be different";
    }
    else if (optionErrors.some(err => err)) {
        errors.options = optionErrors;
    }
    // Validate correct answer
    if (!correctAnswer) {
        errors.correctAnswer = "Please select a correct answer";
    }
    else if (!options.includes(correctAnswer)) {
        errors.correctAnswer = "Correct answer must be one of the options";
    }
    return errors;
};
