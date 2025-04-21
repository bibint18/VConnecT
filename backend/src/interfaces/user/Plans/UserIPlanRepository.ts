import { IPlan } from "../../../models/PlansModel";
export interface IUserPlanRepository{
  findActivePlans():Promise<IPlan[]>
}