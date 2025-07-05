import { IPlan } from "../../../models/PlansModel";

export interface IAdminPlanService{
  createPlan(planData: Partial<IPlan>): Promise<IPlan | null>
  gettAllPlans(search:string,sort:string,page:number,limit:number) : Promise<{ plans: IPlan[], total: number }>
  getPlanById(planId:string) : Promise <IPlan | null>
  updatePlan(planId:string,updateData: Partial<IPlan>): Promise <IPlan | null>
  deletePlan(planId:string): Promise<boolean>
}