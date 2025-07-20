import { IUserRewardRepo} from "../../../interfaces/user/Reward/IUserRepository.js";
import { IReward, Reward } from "../../../models/RewardModel.js";
import { User } from "../../../models/User.js";
export class UserRewardRepository implements IUserRewardRepo {
  async findRewardById(rewardId: string): Promise<IReward | null> {
    return await Reward.findOne({ rewardId, isDeleted: false, isActive: true });
  }
  async findAllRewards(page: number, limit: number,search: string,
    sortField: string,sortOrder: string,userId:string,filter: string): Promise<{ rewards: IReward[]; total: number }> {
    const query: any = {
      isDeleted: false,
      isActive: true,
    };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (sortField === "requiredPoints") {
      query.requiredPoints = { $ne: null }; 
    } else if (sortField === "requiredStreak") {
      query.requiredStreak = { $ne: null }; 
    }
    const user = await User.findById(userId).select("point streak claimedRewards").lean();
    if (!user) {
      throw new Error("User not found");
    }

    const claimedRewardIds = user.claimedRewards.map((cr) => cr.rewardId);
    if (filter === "claimed") {
      query.rewardId = { $in: claimedRewardIds };
    } else if (filter === "notClaimed") {
      query.rewardId = { $nin: claimedRewardIds };
    } else if (filter === "unlocked") {
      query.$and = [
    {
      $or: [
        { requiredPoints: { $ne: null, $lte: user.point } },
        { requiredStreak: { $ne: null, $lte: user.streak } },
      ],
    },
    {
      rewardId: { $nin: claimedRewardIds },
    },
  ];
    } else if (filter === "locked") {
      query.$and = [
        {
          $or: [
            { requiredPoints: { $exists: false } },
            { requiredPoints: { $gt: user.point } },
          ],
        },
        {
          $or: [
            { requiredStreak: { $exists: false } },
            { requiredStreak: { $gt: user.streak } },
          ],
        },
      ];
    }
    const sort: any = {};
    sort[sortField] = sortOrder === "asc" ? 1 : -1;
    const rewards = await Reward.find(query).sort(sort).skip((page - 1) * limit).limit(limit).lean()
    const total = await Reward.countDocuments(query);
    return { rewards, total };
  }
}