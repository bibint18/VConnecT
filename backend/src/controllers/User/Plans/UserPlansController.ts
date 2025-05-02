import { IUserPlanController } from "../../../interfaces/user/Plans/IUserPlansController";
import { Request,Response,NextFunction } from "express";
import { UserIPlanService } from "../../../interfaces/user/Plans/UserIplansService";

export class UserPlanController implements IUserPlanController{
  private planService:UserIPlanService
  constructor(planService:UserIPlanService){
    this.planService=planService
  }

 async getPlans(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const plans = await this.planService.getActivePlans()
      console.log("plans fetched ",plans)
      res.status(200).json({
        success: true,
        data: plans,
        message: "Plans fetched successfully",
      });
    } catch (error) {
      next(error)
    }
  }

  async getUserPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log("reached userPlan getting")
      const userId = req.user?.id as string;
      if (!userId) {
        throw new Error("User not authenticated");
      }
      const userPlan = await this.planService.getUserPlan(userId);
      res.status(200).json({
        success: true,
        data: userPlan,
        message: "User plan fetched successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}