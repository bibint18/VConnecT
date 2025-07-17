import { UserIPlanService } from "../../../interfaces/user/Plans/UserIplansService.js";
import { IUserPlanRepository } from "../../../interfaces/user/Plans/UserIPlanRepository.js";
import { IPlan } from "../../../models/PlansModel.js";
import { IUserRepository } from "../../../interfaces/IUserRepository.js";
import { IUser } from "../../../models/User.js";
import { Types } from "mongoose";

export class UserPlanService implements UserIPlanService{
  private planRepository:IUserPlanRepository
  private userRepository:IUserRepository
  constructor(planRepository:IUserPlanRepository,userRepository:IUserRepository){
    this.planRepository=planRepository
    this.userRepository=userRepository
  }

  async getActivePlans(page: number, limit: number): Promise<{ plans: IPlan[]; total: number; }> {
    return await this.planRepository.findActivePlans(page,limit)
  }

  async updateUserPlan(userId: string, planId: string, transactionId: string): Promise<IUser> {
    try{
    const user = await this.userRepository.findByIdd(userId);
    if (!user) throw new Error("User not found");
    const {plans} = await this.planRepository.findActivePlans(1,100)
    const selectedPlan = plans.find((p) => p._id.toString() === planId)
    
    if (!selectedPlan) throw new Error("Plan not found");
    console.log("Selected plan:", selectedPlan); 
    console.log("roomBenefit:", selectedPlan.roomBenefit); 
    console.log("selectedPlan type:", Object.getPrototypeOf(selectedPlan));
    const durationMap: Record<IPlan['duration'], number> = {
      "1 month": 30,
      "3 months": 90,
      "6 months": 180,
      "9 months": 270,
      "12 months": 365
    };
    const durationDays = durationMap[selectedPlan.duration];
    if (!durationDays) {
      throw new Error(`Invalid duration: ${selectedPlan.duration}`);
    }
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);
      const roomBenefit = selectedPlan.roomBenefit
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
      return await this.userRepository.updateUserPlans(userId,planUpdate,roomBenefit)
    }catch(error){
      throw new Error(`Service error ${error}`);
    }
  }

  async getUserPlan(userId: string): Promise<{ planId: string; planName: string; status: string; startDate: Date; endDate?: Date; transactionId?: string; roomBenefit: number; } | null> {
    const user = await this.userRepository.findByIdd(userId);
    if(!user){
      throw new Error("User not found")
    }
    const activePlan = user.plan.filter((p) => p.status ==='active').sort((a,b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())[0]
    console.log('active plan ',activePlan)
    if(!activePlan){
      return null
    }
    const {plans} = await this.planRepository.findActivePlans(1,100)
    const plan = plans.find((p) => p._id.toString()===activePlan.planId.toString())
    const roomBenefit=plan ? plan.roomBenefit || 0 : 0
    return {
      planId: activePlan.planId.toString(),
      planName: activePlan.planName,
      status: activePlan.status,
      startDate: activePlan.startDate,
      endDate: activePlan.endDate, 
      transactionId: activePlan.transactionId, 
      roomBenefit 
    };
  }

  async getUserPlanHistory(userId: string, page: number, limit: number): Promise<{ plans: IUser["plan"]; total: number; }> {
    return await this.planRepository.getUserPlanHistory(userId,page,limit)
  }

}