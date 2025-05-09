import { IReward } from "../../../models/RewardModel.js";

export interface IRewardRepository {
  createReward(reward: Partial<IReward>): Promise<IReward>;
  findRewardById(rewardId: string): Promise<IReward | null>;
  findAllRewards(page: number, limit: number, searchTerm: string): Promise<{ rewards: IReward[]; total: number }>;
  updateReward(rewardId: string, updates: Partial<IReward>): Promise<IReward | null>;
  deleteReward(rewardId: string): Promise<void>;
}