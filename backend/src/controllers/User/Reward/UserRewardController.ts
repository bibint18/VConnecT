
import { IUserRewardService } from "../../../interfaces/user/Reward/IUserRewardService.js";
import { Response,Request,NextFunction } from "express";
import { IUserRewardController } from "../../../interfaces/user/Reward/IUserRewardController.js";

export class UserRewardController implements IUserRewardController{
  constructor(
    private userRewardService:IUserRewardService,
  ){}

  async getUserRewards(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rewards = await this.userRewardService.getUserRewards(req.user?.id as string)
      res.status(200).json({ success: true, data: rewards });
    } catch (error) {
      next(error)
    }
  }

  async claimReward(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log("Reached claim controller",req.params)
      const {rewardid} = req.params
      console.log("Reached claim controller data ",rewardid)
      const userId = req.user?.id
      await this.userRewardService.claimReward(userId as string,req.params.rewardid)
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

  async getUserDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {userId} = req.params
      const user = await this.userRewardService.getUserDetails(userId)
      if (!user) throw new Error("User not found");
      res.status(200).json({success:true,data:user})
    } catch (error) {
      next(error)
    }
  }
}