import { IReward } from "../../../models/RewardModel";

export interface IUserRewardRepo {
  findRewardById(rewardId: string): Promise<IReward | null>;
  findAllRewards(page: number, limit: number, searchTerm: string): Promise<{ rewards: IReward[]; total: number }>;
}