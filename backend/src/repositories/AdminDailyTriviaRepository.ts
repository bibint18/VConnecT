import { IAdminDailyTriviaRepository } from "../interfaces/AdminIDailyTriviaReposiroy";
import { DailyTrivia, IDailyTrivia } from "../models/DailyTriviaModel";
import { AppError } from "../utils/AppError";

export class AdminDailyTriviaReposiroy implements IAdminDailyTriviaRepository{
  async addTriviaQuestion(question: string, setNumber: number, options: string[], correctAnswer: string): Promise<IDailyTrivia> {
    try {
      if(options.length !==4){
        throw new AppError("4 options required",400)
      }
      if(!options.includes(correctAnswer)){
        throw new AppError("Answer should be in option",400)
      }
      const trivia = await DailyTrivia.create({
        question,
        setNumber,
        options,
        correctAnswer,
        isListed:false
      })
      console.log("trivia added",trivia)
      return trivia
    } catch (error) {
      throw error instanceof AppError ? error : new AppError("failed to add trivia",500)
    }
  }
}