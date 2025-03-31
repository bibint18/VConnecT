import { Request,Response,NextFunction } from "express";

export interface AdminIDailyTriviaController{
  addTriviaQuestion(req:Request,res:Response,next:NextFunction):Promise<void>;
  getTriviaQuestions(req:Request,res:Response,next:NextFunction):Promise<void>
  updateTriviaQuestion(req:Request,res:Response,next:NextFunction):Promise<void>
  deleteTriviaQuestion(req:Request,res:Response,next:NextFunction):Promise<void>
  getTriviaQuestionById(req: Request, res: Response, next: NextFunction): Promise<void>;
}