
import { IUser } from "../../../models/User.js";

export interface IUserRewardService{
  getUserRewards(userId: string,page: number,
    limit: number): Promise<{ rewards: RewardResponse[], total: number }>;
  claimReward(userId: string, rewardId: string): Promise<void>;
  checkIn(userId: string): Promise<IUser>;
  getUserDetails(userId:string):Promise<IUser | null>;
}

export interface RewardResponse {
  rewardId: string;
  title: string;
  description: string;
  type: "room_creation" | "bonus_points";
  value: number;
  requiredPoints?: number;
  requiredStreak?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  isUnlocked: boolean;
  isClaimed: boolean;
}
