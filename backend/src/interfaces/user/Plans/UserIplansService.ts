import { IPlan } from "../../../models/PlansModel";
import { IUser } from "../../../models/User";

export interface UserIPlanService{
  getActivePlans():Promise<IPlan[]>
  updateUserPlan(userId:string,planId:string,transactionId:string):Promise<IUser>
}