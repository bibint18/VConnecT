import { IDailyTrivia } from "../models/DailyTriviaModel";

export interface IAdminDailyTriviaService{
  addTriviaQuestion(question: string,setNumber: number,options: string[],correctAnswer: string):Promise<IDailyTrivia>
}