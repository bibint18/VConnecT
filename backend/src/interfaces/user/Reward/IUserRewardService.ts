import { IReward } from "../../../models/RewardModel.js";
import { IUser } from "../../../models/User.js";

export interface IUserRewardService{
  getUserRewards(userId: string): Promise<IReward[]>;
  claimReward(userId: string, rewardId: string): Promise<void>;
  checkIn(userId: string): Promise<IUser>;
  getUserDetails(userId:string):Promise<IUser | null>;
}