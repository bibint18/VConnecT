import { IRewardController } from "../../../interfaces/Admin/Reward/IRewardController";
import { IUserRewardService } from "../../../interfaces/user/Reward/IUserRewardService";
import { IRewardService } from "../../../interfaces/Admin/Reward/IRewardService";
import { Response,Request,NextFunction } from "express";

export class AdminRewardController implements IRewardController{
  constructor(
    private adminRewardService:IRewardService
  ){}

  async createReward(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id
      const reward = await this.adminRewardService.createReward(req.body,userId)
      res.status(200).json({success:true,data:reward})
    } catch (error) {
      next(error)
    }
  }

  async updateReward(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.id
      const reward = await this.adminRewardService.updateReward(req.params.rewardId,req.body,userId)
      res.status(200).json({ success: true, data: reward });
    } catch (error) {
      next(error)
    }
  }

  async deleteReward(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id
      await this.adminRewardService.deleteReward(req.params.rewardId,userId)
      res.status(200).json({ success: true, message: "Reward deleted" });
    } catch (error) {
      next(error)
    }
  }

  async getRewards(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {page=1,limit=10,search = ''} = req.query;
      const result = await this.adminRewardService.getRewards(Number(page),Number(limit),String(search))
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error)
    }
  }

  async  getRewardById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {rewardId} = req.query
      console.log("rewardId",rewardId)
      const result = await this.adminRewardService.findRewardById(String(rewardId))
      res.status(200).json({success:true,data:result})
    } catch (error) {
      next(error)
    }
  }
}