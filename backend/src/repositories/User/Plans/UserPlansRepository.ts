import { IUserPlanRepository } from "../../../interfaces/user/Plans/UserIPlanRepository";
import { Plan,IPlan } from "../../../models/PlansModel";

export class UserPlanRepository implements IUserPlanRepository{
  async findActivePlans(): Promise<IPlan[]> {
      const plans =  await Plan.find({isListed:true,isDeleted:false}).sort({regularAmount:1})
      if(!plans){
        throw new Error("No plans to fetch...")
      }
      return plans
  }
}