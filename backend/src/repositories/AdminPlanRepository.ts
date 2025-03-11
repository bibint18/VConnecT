import { IPlanRepository } from "../interfaces/IAdminPlanRepository";
import { IPlan,Plan } from "../models/PlansModel";

export class PlansRepository implements IPlanRepository{
  async createPlan(planData: Partial<IPlan>): Promise<IPlan | null> {
    const existingPlan = await Plan.findOne({ name: planData.name });
  if (existingPlan) {
    throw new Error("A plan with this name already exists");
  }
    return await Plan.create(planData)
  }
  async getAllPlans(search:string,sort:string,page:number,limit:number): Promise<{ plans: IPlan[], total: number }> {
    const query:any ={isDeleted:false}
    if(search){
      query.name={$regex:search,$options: "i"};
    }
    let sortQuery: any = {}
    if(sort==="A-Z"){
      sortQuery={name:1}
    }else if(sort==='Z-A'){
      sortQuery={name:-1}
    }else if(sort==='saleLowHigh'){
      sortQuery={discountAmount:1}
    }else if(sort ==='saleHighLow'){
      sortQuery={discountAmount:-1}
    }
    const total = await Plan.countDocuments(query)
    const plans = await Plan.find(query)
    .sort(sortQuery)
    .skip((page - 1) * limit)
    .limit(limit);
    return {plans,total}
  }
  async getPlanById(planId: string): Promise<IPlan | null> {
    return await Plan.findById(planId)
  }
  async updatePlan(planId: string, updateData: Partial<IPlan>): Promise<IPlan | null> {
    if (updateData.name) {
      const existingPlan = await Plan.findOne({ name: updateData.name, _id: { $ne: planId } });
      if (existingPlan) {
          throw new Error("A plan with this name already exists.");
      }
  }
    return await Plan.findByIdAndUpdate(planId,updateData,{new:true})
  }
  async deletePlan(planId: string): Promise<boolean> {
    const plan = await Plan.findByIdAndUpdate(planId,{isDeleted:true})
    return plan !==null
  }
}