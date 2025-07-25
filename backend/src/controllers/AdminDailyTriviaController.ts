import { Request,Response,NextFunction } from "express";
import { IAdminDailyTriviaService } from "../interfaces/AdminIDailyTriviaService.js";
import { AdminIDailyTriviaController } from "../interfaces/AdminIDailyTriviaController.js";
import { HTTP_STATUS_CODE } from "../utils/statusCode.js";
import { TriviaMapper } from "../mappers/AdminTrivia/AdminTriviaMapper.js";

export class AdminDailyTriviaController implements AdminIDailyTriviaController{
  private triviaService:IAdminDailyTriviaService
  constructor(triviaService:IAdminDailyTriviaService){
    this.triviaService=triviaService
  }

  async addTriviaQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {question,options,correctAnswer} = req.body
      if (!question  || !options || !correctAnswer) {
        res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ message: "All fields are required" });
        return;
      }
      const trivia = await this.triviaService.addTriviaQuestion(question,options,correctAnswer)
      res.status(HTTP_STATUS_CODE.OK).json({message:"trivia question added",trivia:TriviaMapper.toTriviaDetailsResponse(trivia)})
    } catch (error) {
      next(error)
    }
  }

  async getTriviaQuestions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {page=1,limit=5,searchTerm=''} = req.query
      const result = await this.triviaService.getTriviaQuestions(Number(page),Number(limit),String(searchTerm))
      res.status(HTTP_STATUS_CODE.OK).json(TriviaMapper.toTriviaListResponse(result.questions,result.total))
    } catch (error) {
      next(error)
    }
  }

  async updateTriviaQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {id} = req.params
      const {question,options,correctAnswer} = req.body;
      if (!question || !options || !correctAnswer) {
        res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ message: "All fields are required" });
        return;
      }
      const trivia = await this.triviaService.updateTriviaQuestion(id,question,options,correctAnswer)
      res.status(HTTP_STATUS_CODE.OK).json({message:"Trivia Question updated",trivia:TriviaMapper.toTriviaDetailsResponse(trivia)})
    } catch (error) {
      next(error)
    }
  }

  async deleteTriviaQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {id} = req.params
      const trivia = await this.triviaService.deleteTriviaQuestion(id)
      res.status(HTTP_STATUS_CODE.OK).json({message:"Trivia deleted successfully",trivia:TriviaMapper.toTriviaDetailsResponse(trivia)})
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
      res.status(HTTP_STATUS_CODE.OK).json({ trivia:TriviaMapper.toTriviaDetailsResponse(trivia) });
    } catch (error) {
      next(error);
    }
  }
}