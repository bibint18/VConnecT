
import { IAdminDailyTriviaRepository } from "../interfaces/AdminIDailyTriviaReposiroy.js";
import { DailyTrivia, IDailyTrivia } from "../models/DailyTriviaModel.js";
import { AppError } from "../utils/AppError.js";
import { BaseRepository } from "./Base/BaseRepository.js";

export class AdminDailyTriviaReposiroy extends BaseRepository<IDailyTrivia> implements IAdminDailyTriviaRepository{
  constructor(){
    super(DailyTrivia)
  }
  async addTriviaQuestion(question: string, options: string[], correctAnswer: string): Promise<IDailyTrivia> {
    try {
      if(options.length !==4){
        throw new AppError("4 options required",400)
      }
      if(!options.includes(correctAnswer)){
        throw new AppError("Answer should be in option",400)
      }
      const lastTrivia = await this.findOne({}).sort({setNumber:-1}).exec()
      const setNumber = lastTrivia ? lastTrivia.setNumber + 1 : 1
      const trivia = await this.create({question,setNumber,options,correctAnswer,isListed:false})
      console.log(trivia)
      if(!trivia){
        throw new AppError("Failed to add Trivia",400)
      }
      return trivia
    } catch (error) {
      throw error instanceof AppError ? error : new AppError("failed to add trivia",500)
    }
  }

    async getTriviaQuestions(page: number, limit: number, searchTerm: string,): Promise<{ questions: IDailyTrivia[]; total: number; }> {
    const query:any = {isDeleted:false}
    if(searchTerm){
      query.question = {$regex:searchTerm,$options:'i'}
    }
    const questions = await this.findMany(query).sort({createdAt:-1}).skip((page -1) * limit).limit(limit).exec()
    console.log(questions)
    const total = await this.count(query)
    return {questions,total}
  }

  async updateTriviaQuestion(id: string, question: string, options: string[], correctAnswer: string): Promise<IDailyTrivia> {
    if(options.length !==4) throw new AppError("4 options required",400)
      if (!options.includes(correctAnswer)) throw new AppError("Correct answer must be one of the options", 400);
    const trivia = await this.update(id,{question,options,correctAnswer})
    console.log(trivia)
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
    const trivia =await this.findById(id).exec()
    if (!trivia || trivia.isDeleted) throw new AppError("Trivia question not found", 404);
    return trivia;
  }
}