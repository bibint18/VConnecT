import { IUserPlanController } from "../../../interfaces/user/Plans/IUserPlansController.js";
import { Request, Response, NextFunction } from "express";
import { UserIPlanService } from "../../../interfaces/user/Plans/UserIplansService.js";
import { HTTP_STATUS_CODE } from "../../../utils/statusCode.js";

export class UserPlanController implements IUserPlanController {
  private planService: UserIPlanService;
  constructor(planService: UserIPlanService) {
    this.planService = planService;
  }

  async getPlans(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const plans = await this.planService.getActivePlans();
      res.status(HTTP_STATUS_CODE.OK).json({
        success: true,
        data: plans,
        message: "Plans fetched successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserPlan(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id as string;
      if (!userId) {
        throw new Error("User not authenticated");
      }
      const userPlan = await this.planService.getUserPlan(userId);
      res.status(HTTP_STATUS_CODE.OK).json({
        success: true,
        data: userPlan,
        message: "User plan fetched successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
