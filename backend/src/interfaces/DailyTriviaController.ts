import { Request,Response,NextFunction } from "express"
export interface IDailyTriviaController{
  getDailyTriviaQuestions(req: Request, res: Response, next: NextFunction): Promise<void>
  submitTriviaAnswer(req: Request, res: Response, next: NextFunction): Promise<void>
}