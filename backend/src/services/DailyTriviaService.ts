import { DailyTriviaResponseDto } from "../dtos/DailyTrivia/DailyTriviaResponse.dto.js";
import { SubmitTriviaResponseDto } from "../dtos/DailyTrivia/SubmitTriviaResponse.dto.js";
import { IDailyTriviaRepository } from "../interfaces/DailyTriviaRepository.js";
import { IDailyTriviaService } from "../interfaces/DailyTriviaService.js";
import { DailyTriviaMapper } from "../mappers/DailyTrivia/DailyTriviaMapper.js";

export class DailyTriviaService implements IDailyTriviaService{
  private triviaRepository:IDailyTriviaRepository
  constructor(triviaRepository:IDailyTriviaRepository){
    this.triviaRepository=triviaRepository
  }
  async getDailyTriviaQuestions(limit: number): Promise<DailyTriviaResponseDto[]> {
    const questions= await this.triviaRepository.getDailyTriviaQuestions(limit)
    return DailyTriviaMapper.toDailyTriviaResponseArray(questions)
  }
  async submitTriviaAnswer(userId: string, triviaId: string, submittedAnswer: string): Promise<SubmitTriviaResponseDto> {
    const result= await this.triviaRepository.submitTriviaAnswer(userId,triviaId,submittedAnswer)
    return DailyTriviaMapper.toSubmitTriviaResponse(result)
  }
}