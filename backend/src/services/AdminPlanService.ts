import { IPlan,Plan } from "../models/PlansModel";
import { IPlanRepository } from "../interfaces/IAdminPlanRepository";

export class PlanService{
  private planRepository :IPlanRepository;
  constructor(planRepository:IPlanRepository){
    this.planRepository=planRepository
  }
  async createPlan(planData: Partial<IPlan>): Promise<IPlan | null> {
    return await this.planRepository.createPlan(planData)
  }

  async gettAllPlans() : Promise<IPlan []> {
    return await this.planRepository.getAllPlans()
  }

  async getPlanById(planId:string) : Promise <IPlan | null>{
    return await this.planRepository.getPlanById(planId)
  }

  async updatePlan(planId:string,updateData: Partial<IPlan>): Promise <IPlan | null>{
    console.log("reached service planid",planId)
    return await this.planRepository.updatePlan(planId,updateData)
  }
}