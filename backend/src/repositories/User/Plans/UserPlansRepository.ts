import { IUserPlanRepository } from "../../../interfaces/user/Plans/UserIPlanRepository.js";
import { Plan, IPlan } from "../../../models/PlansModel.js";
import { IUser, User } from "../../../models/User.js";
import { AppError } from "../../../utils/AppError.js";
import { HTTP_STATUS_CODE } from "../../../utils/statusCode.js";
import { BaseRepository } from "../../Base/BaseRepository.js";

export class UserPlanRepository extends BaseRepository<IPlan> implements IUserPlanRepository {
  constructor(){
    super(Plan)
  }
  async findActivePlans(page:number,limit:number): Promise<{ plans: IPlan[]; total: number }> {
    // const plans = await Plan.find({ isListed: true, isDeleted: false })
    const plans = await this.findMany({isListed:true,isDeleted:false})
    .sort({regularAmount: 1}).skip((page-1)*limit).limit(limit)
    if (!plans) {
      throw new Error("No plans to fetch...");
    }
    // const totalPlans = await Plan.countDocuments({isListed:true,isDeleted:false})
    const totalPlans = await this.count({isListed:true,isDeleted:false})
    return {plans,total:totalPlans}
  }

  async getUserPlanHistory(userId: string, page: number, limit: number): Promise<{ plans: IUser["plan"]; total: number; }> {
    const skip=(page-1)*limit
    const user = await User.findById(userId).select('plan').lean()
    if(!user){
      throw new AppError("User not found",HTTP_STATUS_CODE.NOT_FOUND)
    }
    const allPlans = user.plan.sort((a,b) => {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    })
    const paginatedPlan=allPlans.slice(skip,skip+limit)
    return {
      plans:paginatedPlan,
      total:allPlans.length
    }
  }
}
