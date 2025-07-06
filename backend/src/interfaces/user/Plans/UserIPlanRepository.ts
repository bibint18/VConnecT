import { IPlan } from "../../../models/PlansModel.js";
export interface IUserPlanRepository{
  findActivePlans(page:number,limit:number):Promise<{plans:IPlan[],total:number}>
}