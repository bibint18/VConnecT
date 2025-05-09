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
    console.log("Selected plan:", selectedPlan); // Should show roomBenefit: 4
    console.log("roomBenefit:", selectedPlan.roomBenefit); // Debug: Confirm undefined
    console.log("selectedPlan type:", Object.getPrototypeOf(selectedPlan));
    const durationMap: Record<IPlan['duration'], number> = {
      "1 month": 30,
      "3 months": 90,
      "6 months": 180,
      "9 months": 270,
      "12 months": 365
    };
    // const durationDays = selectedPlan.duration === "Year" ? 365 : 30; 
    const durationDays = durationMap[selectedPlan.duration];
    if (!durationDays) {
      throw new Error(`Invalid duration: ${selectedPlan.duration}`);
    }
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);
      // await this.userRepository.updateRoomLimit(userId,selectedPlan.roomBenifit)
      const roomBenefit = selectedPlan.roomBenefit
      console.log("roomBenefit serrice",roomBenefit)
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
      return await this.userRepository.updateUserPlans(userId,planUpdate,roomBenefit)
    }catch(error){
      throw new Error(`Service error ${error}`);
    }
  }

  async getUserPlan(userId: string): Promise<{ planId: string; planName: string; status: string; startDate: Date; endDate?: Date; transactionId?: string; roomBenefit: number; } | null> {
    const user = await this.userRepository.findById(userId);
    if(!user){
      throw new Error("User not found")
    }
    const activePlan = user.plan.filter((p) => p.status ==='active').sort((a,b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())[0]
    if(!activePlan){
      return null
    }
    return {
      planId: activePlan.planId.toString(),
      planName: activePlan.planName,
      status: activePlan.status,
      startDate: activePlan.startDate,
      endDate: activePlan.endDate, 
      transactionId: activePlan.transactionId, 
      roomBenefit: user.availableRoomLimit || 0, 
    };
  }

}