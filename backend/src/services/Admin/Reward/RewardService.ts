import { IRewardService } from "../../../interfaces/Admin/Reward/IRewardService";
import { IRewardRepository } from "../../../interfaces/Admin/Reward/IRewardRepository";
import { IUserRepository } from "../../../interfaces/IUserRepository";
import { IReward } from "../../../models/RewardModel";


export class AdminRewardService implements IRewardService{
  constructor(
    private rewardRepository:IRewardRepository,
  ){}

  async createReward(rewardData: Partial<IReward>, adminId: string): Promise<IReward> {
    rewardData.rewardId = `reward_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const reward = await this.rewardRepository.createReward(rewardData)
    return reward
  }

  async updateReward(rewardId: string, updates: Partial<IReward>, adminId: string): Promise<IReward> {
    const reward = await this.rewardRepository.updateReward(rewardId,updates)
    if (!reward) throw new Error("Reward not found");
    return reward
  }
  
  async deleteReward(rewardId: string, adminId: string): Promise<void> {
    await this.rewardRepository.deleteReward(rewardId)
  }

  async getRewards(page: number, limit: number, searchTerm: string): Promise<{ rewards: IReward[]; total: number; }> {
    return await this.rewardRepository.findAllRewards(page,limit,searchTerm)
  }

  async findRewardById(rewardId: string): Promise<IReward | null> {
    return await this.rewardRepository.findRewardById(rewardId)
  }
}