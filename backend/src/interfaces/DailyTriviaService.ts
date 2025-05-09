import { IDailyTrivia } from "../models/DailyTriviaModel.js";

export interface IDailyTriviaService{
  getDailyTriviaQuestions(limit: number): Promise<IDailyTrivia[]>
  submitTriviaAnswer(userId: string,triviaId: string,submittedAnswer: string): Promise<{ isCorrect: boolean; pointsUpdated: boolean }>
}