import { Request,Response,NextFunction } from "express";

export interface IUserPlanController{
  getPlans(req:Request,res:Response,next:NextFunction):Promise<void>
  getUserPlan(req: Request, res: Response, next: NextFunction): Promise<void>
  getUserPlanHistory(req: Request, res: Response, next: NextFunction):Promise<void>
}