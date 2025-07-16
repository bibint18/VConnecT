import { DailyTriviaResponseDto } from "../dtos/DailyTrivia/DailyTriviaResponse.dto.js";
import { SubmitTriviaResponseDto } from "../dtos/DailyTrivia/SubmitTriviaResponse.dto.js";

export interface IDailyTriviaService{
  getDailyTriviaQuestions(limit: number): Promise<DailyTriviaResponseDto[]>
  submitTriviaAnswer(userId: string,triviaId: string,submittedAnswer: string): Promise<SubmitTriviaResponseDto>
}