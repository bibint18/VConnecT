import { Request,Response,NextFunction } from "express";

export interface AdminIDailyTriviaController{
  addTriviaQuestion(req:Request,res:Response,next:NextFunction):Promise<void>
}