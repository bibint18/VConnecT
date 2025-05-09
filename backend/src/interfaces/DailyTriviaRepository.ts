import { IDailyTrivia } from "../models/DailyTriviaModel.js";

export interface IDailyTriviaRepository{
  getDailyTriviaQuestions(limit: number): Promise<IDailyTrivia[]>;
  submitTriviaAnswer(userId: string,triviaId: string,submittedAnswer: string): Promise<{ isCorrect: boolean; pointsUpdated: boolean }>;
}