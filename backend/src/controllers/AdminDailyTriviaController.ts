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
      const {question,options,correctAnswer} = req.body
      if (!question  || !options || !correctAnswer) {
        res.status(400).json({ message: "All fields are required" });
        return;
      }
      const trivia = await this.triviaService.addTriviaQuestion(question,options,correctAnswer)
      res.status(200).json({message:"trivia question added",trivia})
    } catch (error) {
      next(error)
    }
  }

  async getTriviaQuestions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {page=1,limit=4,searchTerm=''} = req.query
      const result = await this.triviaService.getTriviaQuestions(Number(page),Number(limit),String(searchTerm))
      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }

  async updateTriviaQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {id} = req.params
      const {question,options,correctAnswer} = req.body;
      if (!question || !options || !correctAnswer) {
        res.status(400).json({ message: "All fields are required" });
        return;
      }
      const trivia = await this.triviaService.updateTriviaQuestion(id,question,options,correctAnswer)
      res.status(200).json({message:"Trivia Question updated",trivia})
    } catch (error) {
      next(error)
    }
  }

  async deleteTriviaQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {id} = req.params
      const trivia = await this.triviaService.deleteTriviaQuestion(id)
      res.status(200).json({message:"Trivia deleted successfully",trivia})
    } catch (error) {
      next(error)
    }
  }

  async getTriviaQuestionById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log("reached fetbyid")
      const { id } = req.params;
      const trivia = await this.triviaService.getTriviaQuestionById(id);
      console.log("trivia controller",trivia)
      res.status(200).json({ trivia });
    } catch (error) {
      next(error);
    }
  }
}