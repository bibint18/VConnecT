
import { IRewardRepository } from "../../../interfaces/Admin/Reward/IRewardRepository.js";
import { IReward } from "../../../models/RewardModel.js";
import { Reward } from "../../../models/RewardModel.js";
import { BaseRepository } from "../../Base/BaseRepository.js";

export class RewardRepository extends BaseRepository<IReward> implements IRewardRepository{
  constructor(){
    super(Reward)
  }
  async createReward(reward: Partial<IReward>): Promise<IReward> {
    const rewards= await this.create(reward)
    if(!rewards){
      throw new Error("Cannot create reward")
    }
    return rewards
  }

  async findRewardById(rewardId: string): Promise<IReward | null> {
    return this.findOne({rewardId})
  }

  async findAllRewards(page: number, limit: number, searchTerm: string): Promise<{ rewards: IReward[]; total: number; }> {
    const query = {
      isDeleted:false,
      $or:[
        {title:{$regex:searchTerm,$options:"i"}},
        {description:{$regex:searchTerm,$options:'i'}}
      ],
    }
    const rewards = await Reward.find(query).sort({createdAt:-1})
    .skip((page -1 )* limit).limit(limit).lean()
    const total = await this.count(query)
    return {rewards,total}
  }

  async updateReward(rewardId: string, updates: Partial<IReward>): Promise<IReward | null> {
    return await this.findOneAndUpdate({rewardId},updates)
  }

  async deleteReward(rewardId: string): Promise<void> {
    await Reward.findOneAndUpdate({rewardId},{isDeleted:true})
  }
}