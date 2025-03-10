import { IPlanRepository } from "../interfaces/IAdminPlanRepository";
import { IPlan,Plan } from "../models/PlansModel";

export class PlansRepository implements IPlanRepository{
  async createPlan(planData: Partial<IPlan>): Promise<IPlan | null> {
    return await Plan.create(planData)
  }
  async getAllPlans(): Promise<IPlan[]> {
    return await Plan.find({isDeleted:false})
  }
  async getPlanById(planId: string): Promise<IPlan | null> {
    return await Plan.findById(planId)
  }
  async updatePlan(planId: string, updateData: Partial<IPlan>): Promise<IPlan | null> {
    return await Plan.findByIdAndUpdate(planId,updateData,{new:true})
  }
  async deletePlan(planId: string): Promise<boolean> {
    const plan = await Plan.findByIdAndUpdate(planId,{isDeleted:true})
    return plan !==null
  }
}