import { Request,Response,NextFunction } from "express";

export interface IDashboardController{
  getDashboardData(req:Request,res:Response,next:NextFunction):Promise<void>
}