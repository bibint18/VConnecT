import { IPlan } from "../models/PlansModel";

export interface IPlanRepository{
  createPlan(planData:Partial<IPlan>):Promise<IPlan | null>
  getAllPlans() : Promise<IPlan[]>
  getPlanById(planId:string): Promise<IPlan | null>
  updatePlan(planId:string,updateData:Partial<IPlan>):Promise<IPlan | null>
}

