import { title } from "process";
import { IRewardRepository } from "../../../interfaces/Admin/Reward/IRewardRepository";
import { IReward } from "../../../models/RewardModel";
import { Reward } from "../../../models/RewardModel";

export class RewardRepository implements IRewardRepository{
  async createReward(reward: Partial<IReward>): Promise<IReward> {
    return await Reward.create(reward)
  }

  async findRewardById(rewardId: string): Promise<IReward | null> {
    return await Reward.findOne({rewardId})
  }

  async findAllRewards(page: number, limit: number, searchTerm: string): Promise<{ rewards: IReward[]; total: number; }> {
    const query = {
      isDeleted:false,
      $or:[
        {title:{$regex:searchTerm,$options:"i"}},
        {description:{$regex:searchTerm,$options:'i'}}
      ],
    }
    const rewards = await Reward.find(query).skip((page -1 )* limit).limit(limit).lean()
    const total = await Reward.countDocuments(query)
    return {rewards,total}
  }

  async updateReward(rewardId: string, updates: Partial<IReward>): Promise<IReward | null> {
    return await Reward.findOneAndUpdate({rewardId},updates,{new:true})
  }

  async deleteReward(rewardId: string): Promise<void> {
    await Reward.findOneAndUpdate({rewardId},{isDeleted:true})
  }
}