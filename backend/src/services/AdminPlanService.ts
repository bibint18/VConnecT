import { IPlan } from "../models/PlansModel.js";
import { IPlanRepository } from "../interfaces/IAdminPlanRepository.js";

export class PlanService{
  private planRepository :IPlanRepository;
  constructor(planRepository:IPlanRepository){
    this.planRepository=planRepository
  }
  async createPlan(planData: Partial<IPlan>): Promise<IPlan | null> {
    return await this.planRepository.createPlan(planData)
  }

  async gettAllPlans(search:string,sort:string,page:number,limit:number) : Promise<{ plans: IPlan[], total: number }> {
    return await this.planRepository.getAllPlans(search,sort,page,limit)
  }

  async getPlanById(planId:string) : Promise <IPlan | null>{
    return await this.planRepository.getPlanById(planId)
  }

  async updatePlan(planId:string,updateData: Partial<IPlan>): Promise <IPlan | null>{
    console.log("reached service planid",planId)
    return await this.planRepository.updatePlan(planId,updateData)
  }
  
  async deletePlan(planId:string): Promise<boolean>{
    return await this.planRepository.deletePlan(planId)
  }
}