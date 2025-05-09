import { IPlan } from "../../../models/PlansModel.js";
import { IUser } from "../../../models/User.js";

export interface UserIPlanService{
  getActivePlans():Promise<IPlan[]>
  updateUserPlan(userId:string,planId:string,transactionId:string):Promise<IUser>
  getUserPlan(userId: string): Promise<{ planId: string; planName: string; status: string; startDate: Date; endDate?: Date; transactionId?: string; roomBenefit: number; } | null>
}