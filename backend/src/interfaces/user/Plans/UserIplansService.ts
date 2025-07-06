import { IPlan } from "../../../models/PlansModel.js";
import { IUser } from "../../../models/User.js";

export interface UserIPlanService{
  getActivePlans(page:number,limit:number):Promise<{plans:IPlan[],total:number}>
  updateUserPlan(userId:string,planId:string,transactionId:string):Promise<IUser>
  getUserPlan(userId: string): Promise<{ planId: string; planName: string; status: string; startDate: Date; endDate?: Date; transactionId?: string; roomBenefit: number; } | null>
}