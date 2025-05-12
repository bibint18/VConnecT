import { IUser } from "@/components/admin/dashboard/CustomerDashboard";
import axiosInstance from "@/utils/axiosInterceptor";
import { AxiosError } from "axios";

export interface IReward {
  _id: string;
  rewardId: string;
  title: string;
  description: string;
  type: "room_creation" | "bonus_points";
  value: number;
  requiredPoints?: number;
  requiredStreak?: number;
  isActive: boolean;
  isUnlocked?: boolean;
  isClaimed?: boolean;
}

export class RewardService {
  async getRewards(): Promise<IReward[]> {
    try {
      const response = await axiosInstance.get("/rewards");
      return response.data.data;
    } catch (error: unknown) {
      if(error instanceof AxiosError && error.message){
        throw new Error(error.response?.data.message)
      }
      throw new Error("Failed to fetch rewards")
    }
  }

  async claimReward(rewardId: string): Promise<void> {
    try {
      await axiosInstance.post(`/rewards/claim/${rewardId}`);
    } catch (error: unknown) {
      if(error instanceof AxiosError && error.message){
        throw new Error(error.response?.data.message)
      }
      throw new Error("Failed to claim reward")
    }
  }

  async checkIn(): Promise<void> {
    try {
      await axiosInstance.post("/user/checkin");
    } catch (error: unknown) {
       if(error instanceof AxiosError && error.message){
            throw new Error(error.response?.data.message)
          }
          throw new Error("Failed to checkin")
        }
    }

    async getUserDetails(userId:string):Promise<IUser>{
      try {
        const response=await axiosInstance.get(`/user/details/${userId}`)
        return response.data.data
      } catch (error) {
        if(error instanceof AxiosError && error.message){
          throw new Error(error.response?.data.message)
        }
        throw new Error("Failed to fetch details")
      }
    }
  
}