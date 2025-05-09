import { IDailyTrivia} from "../models/DailyTriviaModel.js";

export interface IAdminDailyTriviaRepository{
  addTriviaQuestion(question: string,
    options: string[],
    correctAnswer: string):Promise<IDailyTrivia>;
  getTriviaQuestions(page:number,limit:number,searchTerm:string,) : Promise<{questions: IDailyTrivia[];total:number}>;
  updateTriviaQuestion(id:string,question:string,options:string[],correctAnswer:string): Promise<IDailyTrivia>
  deleteTriviaQuestion(id:string):Promise<IDailyTrivia>
  getTriviaQuestionById(id: string): Promise<IDailyTrivia>;
}