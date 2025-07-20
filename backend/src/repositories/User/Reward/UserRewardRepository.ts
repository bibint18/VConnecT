import { IUserRewardRepo} from "../../../interfaces/user/Reward/IUserRepository.js";
import { IReward, Reward } from "../../../models/RewardModel.js";
export class UserRewardRepository implements IUserRewardRepo {
  async findRewardById(rewardId: string): Promise<IReward | null> {
    return await Reward.findOne({ rewardId, isDeleted: false, isActive: true });
  }

  async findAllRewards(page: number, limit: number, searchTerm: string): Promise<{ rewards: IReward[]; total: number }> {
    const query = {
      isDeleted: false,
      isActive: true,
      $or: [
        { title: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
      ],
    };
    const rewards = await Reward.find(query).skip((page - 1) * limit).limit(limit).lean()
    const total = await Reward.countDocuments(query);
    return { rewards, total };
  }
}