import { IUserRewardService } from "../../../interfaces/user/Reward/IUserRewardService.js";
import { Response, Request, NextFunction } from "express";
import { IUserRewardController } from "../../../interfaces/user/Reward/IUserRewardController.js";
import { HTTP_STATUS_CODE } from "../../../utils/statusCode.js";

export class UserRewardController implements IUserRewardController {
  constructor(private userRewardService: IUserRewardService) {}

  async getUserRewards(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {page = "1", limit = "10",search = "", sortField = "title", sortOrder = "asc",filter = "all" } = req.query;
      const rewardsData = await this.userRewardService.getUserRewards(
        req.user?.id as string,
        parseInt(page as string, 10),
        parseInt(limit as string, 10),
        search as string,
        sortField as string,
        sortOrder as string,
        filter as string
      );
      res.status(HTTP_STATUS_CODE.OK).json({ success: true, data: rewardsData.rewards,total:rewardsData.total });
    } catch (error) {
      next(error);
    }
  }

  async claimReward(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      await this.userRewardService.claimReward(
        userId as string,
        req.params.rewardid
      );
      res
        .status(HTTP_STATUS_CODE.OK)
        .json({ success: true, message: "Reward claimed" });
    } catch (error) {
      next(error);
    }
  }

  async checkIn(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await this.userRewardService.checkIn(req.user!.id);
      res.status(HTTP_STATUS_CODE.OK).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  async getUserDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.params;
      const user = await this.userRewardService.getUserDetails(userId);
      if (!user) throw new Error("User not found");
      res.status(HTTP_STATUS_CODE.OK).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }
}
