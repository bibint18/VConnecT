import { IAdminDailyTriviaService } from "../interfaces/AdminIDailyTriviaService";
import { IAdminDailyTriviaRepository } from "../interfaces/AdminIDailyTriviaReposiroy";
import { IDailyTrivia } from "../models/DailyTriviaModel";

export class AdminDailyTriviaService implements IAdminDailyTriviaService{
  private triviaRepository: IAdminDailyTriviaRepository
  constructor(triviaRepository:IAdminDailyTriviaRepository){
    this.triviaRepository=triviaRepository
  }
  async addTriviaQuestion(question: string, options: string[], correctAnswer: string): Promise<IDailyTrivia> {
    return await this.triviaRepository.addTriviaQuestion(question,options,correctAnswer)
  }

  async getTriviaQuestions(page: number, limit: number, searchTerm: string): Promise<{ questions: IDailyTrivia[]; total: number; }> {
    return await this.triviaRepository.getTriviaQuestions(page,limit,searchTerm)
  }
}