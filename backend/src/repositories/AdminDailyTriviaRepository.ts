import { IAdminDailyTriviaRepository } from "../interfaces/AdminIDailyTriviaReposiroy";
import { DailyTrivia, IDailyTrivia } from "../models/DailyTriviaModel";
import { AppError } from "../utils/AppError";

export class AdminDailyTriviaReposiroy implements IAdminDailyTriviaRepository{
  async addTriviaQuestion(question: string, options: string[], correctAnswer: string): Promise<IDailyTrivia> {
    try {
      if(options.length !==4){
        throw new AppError("4 options required",400)
      }
      if(!options.includes(correctAnswer)){
        throw new AppError("Answer should be in option",400)
      }
      const lastTrivia = await DailyTrivia.findOne().sort({setNumber:-1}).exec()
      const setNumber = lastTrivia ? lastTrivia.setNumber + 1 : 1
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

    async getTriviaQuestions(page: number, limit: number, searchTerm: string,): Promise<{ questions: IDailyTrivia[]; total: number; }> {
    const query:any = {}
    if(searchTerm){
      query.question = {$regex:searchTerm,$options:'i'}
    }
    const questions = await DailyTrivia.find(query).skip((page -1) * limit).limit(limit).exec()
    const total = await DailyTrivia.countDocuments(query)
    return {questions,total}
  }

  async updateTriviaQuestion(id: string, question: string, options: string[], correctAnswer: string): Promise<IDailyTrivia> {
    if(options.length !==4) throw new AppError("4 options required",400)
      if (!options.includes(correctAnswer)) throw new AppError("Correct answer must be one of the options", 400);
    const trivia = await DailyTrivia.findByIdAndUpdate(id,{question,options,correctAnswer},{new:true}).exec()
    if (!trivia || trivia.isDeleted) throw new AppError("Trivia question not found", 404);
    return trivia
  }

  async deleteTriviaQuestion(id: string): Promise<IDailyTrivia> {
    const trivia = await DailyTrivia.findByIdAndUpdate(
      id,{isDeleted:true}
    ).exec()
    if(!trivia) throw new AppError("Trivia question not found",404)
    return trivia
  }

  async getTriviaQuestionById(id: string): Promise<IDailyTrivia> {
    const trivia = await DailyTrivia.findById(id).exec();
    if (!trivia || trivia.isDeleted) throw new AppError("Trivia question not found", 404);
    return trivia;
  }
}