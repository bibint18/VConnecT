import { IReward } from "../../../models/RewardModel.js";

export interface IRewardService {
  createReward(rewardData: Partial<IReward>, adminId: string): Promise<IReward>;
  updateReward(rewardId: string, updates: Partial<IReward>, adminId: string): Promise<IReward>;
  deleteReward(rewardId: string, adminId: string): Promise<void>;
  getRewards(page: number, limit: number, searchTerm: string): Promise<{ rewards: IReward[]; total: number }>;
  findRewardById(rewardId:string):Promise<IReward | null>
}