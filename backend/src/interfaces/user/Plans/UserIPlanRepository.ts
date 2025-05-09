import { IPlan } from "../../../models/PlansModel.js";
export interface IUserPlanRepository{
  findActivePlans():Promise<IPlan[]>
}