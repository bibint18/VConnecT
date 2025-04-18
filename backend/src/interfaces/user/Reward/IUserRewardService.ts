import { IReward } from "../../../models/RewardModel";
import { IUser } from "../../../models/User";

export interface IUserRewardService{
  getUserRewards(userId: string): Promise<IReward[]>;
  claimReward(userId: string, rewardId: string): Promise<void>;
  checkIn(userId: string): Promise<IUser>;
  getUserDetails(userId:string):Promise<IUser | null>;
}