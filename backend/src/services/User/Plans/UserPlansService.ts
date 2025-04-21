import { UserIPlanService } from "../../../interfaces/user/Plans/UserIplansService";
import { IUserPlanRepository } from "../../../interfaces/user/Plans/UserIPlanRepository";
import { IPlan } from "../../../models/PlansModel";
import { IUserRepository } from "../../../interfaces/IUserRepository";
import { IUser } from "../../../models/User";
import { Types } from "mongoose";

export class UserPlanService implements UserIPlanService{
  private planRepository:IUserPlanRepository
  private userRepository:IUserRepository
  constructor(planRepository:IUserPlanRepository,userRepository:IUserRepository){
    this.planRepository=planRepository
    this.userRepository=userRepository
  }

  async getActivePlans(): Promise<IPlan[]> {
    return await this.planRepository.findActivePlans()
  }

  async updateUserPlan(userId: string, planId: string, transactionId: string): Promise<IUser> {
    try{
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error("User not found");
    const plan = await this.planRepository.findActivePlans()
    const selectedPlan = plan.find((p) => p._id.toString() === planId)
    if (!selectedPlan) throw new Error("Plan not found");
    const durationDays = selectedPlan.duration === "Year" ? 365 : 30; 
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);
      // return await this.userRepository.updateUserPlans(userId, {
      //   planId: new Types.ObjectId(selectedPlan._id),
      //   planName: selectedPlan.name,
      //   status: "active",
      //   startDate,
      //   endDate,
      //   transactionId,
      // });
      const planUpdate: {
        planId: Types.ObjectId;
        planName: string;
        status: "active" | "expired" | "cancelled";
        startDate: Date;
        endDate: Date;
        transactionId: string;
      } = {
        planId: new Types.ObjectId(selectedPlan._id),
        planName: selectedPlan.name,
        status: "active", 
        startDate,
        endDate,
        transactionId,
      };
      console.log("user plans updating data",planUpdate)
      return await this.userRepository.updateUserPlans(userId,planUpdate)
    }catch(error){
      throw new Error(`Service error ${error}`);
    }
  }
}