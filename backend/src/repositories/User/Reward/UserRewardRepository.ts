import { IUserRewardRepository } from "../../../interfaces/user/Reward/IUserRepository";
import { IUser,User } from "../../../models/User";
export class UserRewardRepository implements IUserRewardRepository {
  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  async updateUser(id: string, updates: Partial<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, updates, { new: true });
  }

  async updateRoomLimit(userId: string, increment: number): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      userId,
      { $inc: { availableRoomLimit: increment } },
      { new: true }
    );
  }

  async addClaimedReward(userId: string, rewardId: string): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      userId,
      { $push: { claimedRewards: { rewardId, claimedAt: new Date() } } },
      { new: true }
    );
  }

  async updatePoints(userId: string, points: number): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      userId,
      { $inc: { point: points } },
      { new: true }
    );
  }

  async updateStreak(userId: string, streak: number, lastUpdate: Date): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      userId,
      { streak, lastStreakUpdate: lastUpdate },
      { new: true }
    );
  }
}