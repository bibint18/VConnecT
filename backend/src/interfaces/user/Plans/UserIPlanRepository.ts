import { IPlan } from "../../../models/PlansModel.js";
import { IUser } from "../../../models/User.js";
export interface IUserPlanRepository{
  findActivePlans(page:number,limit:number):Promise<{plans:IPlan[],total:number}>
  getUserPlanHistory(userId: string, page: number, limit: number): Promise<{ plans: IUser['plan'], total: number }>

}