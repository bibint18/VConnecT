import { IAdminDailyTriviaService } from "../interfaces/AdminIDailyTriviaService";
import { IAdminDailyTriviaRepository } from "../interfaces/AdminIDailyTriviaReposiroy";
import { IDailyTrivia } from "../models/DailyTriviaModel";

export class AdminDailyTriviaService implements IAdminDailyTriviaService{
  private triviaRepository: IAdminDailyTriviaRepository
  constructor(triviaRepository:IAdminDailyTriviaRepository){
    this.triviaRepository=triviaRepository
  }
  async addTriviaQuestion(question: string, setNumber: number, options: string[], correctAnswer: string): Promise<IDailyTrivia> {
    return await this.triviaRepository.addTriviaQuestion(question,setNumber,options,correctAnswer)
  }
}