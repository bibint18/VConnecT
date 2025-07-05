import { NextFunction, Request, Response } from "express";

export interface IAdminPlanController{
  createPlan(req: Request, res: Response,next:NextFunction):Promise<void>
  getAllPlans(req: Request, res: Response, next: NextFunction):Promise<void>
  getPlanById(req: Request, res: Response, next: NextFunction):Promise<void>
  updatePlan(req: Request, res: Response,next:NextFunction):Promise<void>
  deletePlan(req: Request, res: Response, next: NextFunction):Promise<void>
}