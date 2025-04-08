import { Request,Response,NextFunction } from "express";

export interface IChatController{
  sendMessage(req:Request,res:Response,next:NextFunction): Promise<void>
  getChatHistory(req:Request,res:Response,next:NextFunction): Promise<void>
}