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
}