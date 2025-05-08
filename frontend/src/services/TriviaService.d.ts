export interface ITrivia {
    _id: string;
    setNumber: number;
    question: string;
    options: string[];
    correctAnswer: string;
    isDeleted: boolean;
}
interface ISubmitAnswerResponse {
    isCorrect: boolean;
    pointsUpdated: boolean;
}
export declare const fetchDailyTriviaQuestions: () => Promise<{
    questions: ITrivia[];
    point: number;
}>;
export declare const submitTriviaAnswer: (triviaId: string, submittedAnswer: string) => Promise<ISubmitAnswerResponse>;
export {};
