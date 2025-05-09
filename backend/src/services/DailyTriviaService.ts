import { IDailyTriviaRepository } from "../interfaces/DailyTriviaRepository.js";
import { IDailyTriviaService } from "../interfaces/DailyTriviaService.js";
import { IDailyTrivia } from "../models/DailyTriviaModel.js";

export class DailyTriviaService implements IDailyTriviaService{
  private triviaRepository:IDailyTriviaRepository
  constructor(triviaRepository:IDailyTriviaRepository){
    this.triviaRepository=triviaRepository
  }
  async getDailyTriviaQuestions(limit: number): Promise<IDailyTrivia[]> {
    return await this.triviaRepository.getDailyTriviaQuestions(limit)
  }
  async submitTriviaAnswer(userId: string, triviaId: string, submittedAnswer: string): Promise<{ isCorrect: boolean; pointsUpdated: boolean; }> {
    return await this.triviaRepository.submitTriviaAnswer(userId,triviaId,submittedAnswer)
  }
}