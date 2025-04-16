import { IRewardController } from "../../../interfaces/Admin/Reward/IRewardController";
import { IUserRewardService } from "../../../interfaces/user/Reward/IUserRewardService";
import { IRewardService } from "../../../interfaces/Admin/Reward/IRewardService";
import { Response,Request,NextFunction } from "express";
import { IUserRewardController } from "../../../interfaces/user/Reward/IUserRewardController";

export class UserRewardController implements IUserRewardController{
  constructor(
    private userRewardService:IUserRewardService,
  ){}

  async getUserRewards(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rewards = await this.userRewardService.getUserRewards((req as any).user?.id)
      res.status(200).json({ success: true, data: rewards });
    } catch (error) {
      next(error)
    }
  }

  async claimReward(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id
      await this.userRewardService.claimReward(userId,req.params.rewardId)
      res.status(200).json({ success: true, message: "Reward claimed" });
    } catch (error) {
      next(error)
    }
  }

  async checkIn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await this.userRewardService.checkIn(req.user!.id);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

}