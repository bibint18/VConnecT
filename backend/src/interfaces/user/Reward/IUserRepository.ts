import { IReward } from "../../../models/RewardModel.js";

export interface IUserRewardRepo {
  findRewardById(rewardId: string): Promise<IReward | null>;
  findAllRewards(page: number, limit: number,search: string,
    sortField: string,sortOrder: string,userId:string,filter: string): Promise<{ rewards: IReward[]; total: number }>;
}