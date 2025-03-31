import { IDailyTrivia } from "../models/DailyTriviaModel";

export interface IAdminDailyTriviaService{
  addTriviaQuestion(question: string,options: string[],correctAnswer: string):Promise<IDailyTrivia>;
  getTriviaQuestions(page:number,limit:number,searchTerm:string): Promise<{questions: IDailyTrivia[] ; total : number}>
}