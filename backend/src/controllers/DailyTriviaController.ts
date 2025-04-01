import { Request, Response, NextFunction } from "express";
import { IDailyTriviaController } from "../interfaces/DailyTriviaController";
import { IDailyTriviaService } from "../interfaces/DailyTriviaService";

export class DailyTriviaController implements IDailyTriviaController{
  private triviaService:IDailyTriviaService
  constructor(triviaService:IDailyTriviaService){
    this.triviaService=triviaService
  } 

  async getDailyTriviaQuestions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const questions = await this.triviaService.getDailyTriviaQuestions(5); // Fixed limit of 5
      console.log("questions from controller",questions)
      res.status(200).json({ questions });
    } catch (error) {
      next(error)
    }
  }

  async submitTriviaAnswer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {triviaId,submittedAnswer} = req.body
      const userId = (req as any).user?.id
      console.log("controller triviaId",triviaId)
      console.log("submitt trivia controller",triviaId,userId,submittedAnswer)
      if (!triviaId || !submittedAnswer) {
        res.status(400).json({ message: "Trivia ID and answer are required" });
        return;
      }
      const result = await this.triviaService.submitTriviaAnswer(userId,triviaId,submittedAnswer)
      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }
}