import { Request, Response, NextFunction } from "express";

export interface IUserRewardController {
  getUserRewards(req: Request, res: Response, next: NextFunction): Promise<void>;
  claimReward(req: Request, res: Response, next: NextFunction): Promise<void>;
  checkIn(req: Request, res: Response, next: NextFunction): Promise<void>;
}