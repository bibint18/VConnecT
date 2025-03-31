import { IDailyTrivia} from "../models/DailyTriviaModel";

export interface IAdminDailyTriviaRepository{
  addTriviaQuestion(question: string,
    setNumber: number,
    options: string[],
    correctAnswer: string):Promise<IDailyTrivia>
}