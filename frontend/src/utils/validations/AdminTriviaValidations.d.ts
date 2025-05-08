export interface FormErrors {
    question?: string;
    options?: string[];
    correctAnswer?: string;
}
export declare const validateTriviaForm: (question: string, options: string[], correctAnswer: string) => FormErrors;
