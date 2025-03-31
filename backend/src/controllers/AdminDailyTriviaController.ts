import { Request,Response,NextFunction } from "express";
import { IAdminDailyTriviaService } from "../interfaces/AdminIDailyTriviaService";
import { AdminIDailyTriviaController } from "../interfaces/AdminIDailyTriviaController";

export class AdminDailyTriviaController implements AdminIDailyTriviaController{
  private triviaService:IAdminDailyTriviaService
  constructor(triviaService:IAdminDailyTriviaService){
    this.triviaService=triviaService
  }

  async addTriviaQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {question,setNumber,options,correctAnswer} = req.body
      if (!question || !setNumber || !options || !correctAnswer) {
        res.status(400).json({ message: "All fields are required" });
        return;
      }
      const trivia = await this.triviaService.addTriviaQuestion(question,Number(setNumber),options,correctAnswer)
      res.status(200).json({message:"trivia question added",trivia})
    } catch (error) {
      next(error)
    }
  }
}