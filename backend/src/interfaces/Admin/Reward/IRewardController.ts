import { Request, Response, NextFunction } from "express";

export interface IRewardController {
  createReward(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateReward(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteReward(req: Request, res: Response, next: NextFunction): Promise<void>;
  getRewards(req: Request, res: Response, next: NextFunction): Promise<void>;
  getRewardById(req:Request,res:Response,next:NextFunction):Promise<void>
}