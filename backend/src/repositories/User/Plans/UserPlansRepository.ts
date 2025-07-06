import { IUserPlanRepository } from "../../../interfaces/user/Plans/UserIPlanRepository.js";
import { Plan, IPlan } from "../../../models/PlansModel.js";

export class UserPlanRepository implements IUserPlanRepository {
  async findActivePlans(page:number,limit:number): Promise<{ plans: IPlan[]; total: number }> {
    const plans = await Plan.find({ isListed: true, isDeleted: false }).sort({
      regularAmount: 1,
    }).skip((page-1)*limit).limit(limit).lean()
    if (!plans) {
      throw new Error("No plans to fetch...");
    }
    const totalPlans = await Plan.countDocuments({isListed:true,isDeleted:false})
    return {plans,total:totalPlans}
  }
}
