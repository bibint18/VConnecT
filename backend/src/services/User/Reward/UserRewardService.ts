import { IUserRewardService } from "../../../interfaces/user/Reward/IUserRewardService";
import { IRewardRepository } from "../../../interfaces/Admin/Reward/IRewardRepository";
import { IUserRepository } from "../../../interfaces/IUserRepository";
import { IReward } from "../../../models/RewardModel";
import { IUser } from "../../../models/User";
import { IUserRewardRepo } from "../../../interfaces/user/Reward/IUserRepository";

export class UserRewardService implements IUserRewardService {
  constructor(
    private rewardRepository: IUserRewardRepo,
    private userRepository: IUserRepository
  ) {}

  async getUserRewards(userId: string): Promise<IReward[]> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error("User not found");
    const { rewards } = await this.rewardRepository.findAllRewards(1, 100, "");

    const data = rewards.map((reward) => ({
      ...reward, // .lean() ensures plain object
      isUnlocked: (reward.requiredPoints && user.point >= reward.requiredPoints) ||
                  (reward.requiredStreak && user.streak >= reward.requiredStreak) ||
                  false,
      isClaimed: user.claimedRewards.some((cr) => cr.rewardId === reward.rewardId),
    }));
    console.log("list rewards",data)
    return data
  }

  async claimReward(userId: string, rewardId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error("User not found");
    const reward = await this.rewardRepository.findRewardById(rewardId);
    if (!reward || !reward.isActive) throw new Error("Reward not found or inactive");

    const isUnlocked = (reward.requiredPoints && user.point >= reward.requiredPoints) ||
                      (reward.requiredStreak && user.streak >= reward.requiredStreak);
    if (!isUnlocked) throw new Error("Insufficient points or streak");
    if (user.claimedRewards.some((cr) => cr.rewardId === rewardId)) throw new Error("Reward already claimed");

    if (reward.type === "room_creation") {
      await this.userRepository.updateRoomLimit(userId, reward.value);
    } else if (reward.type === "bonus_points") {
      await this.userRepository.updatePoints(userId, reward.value);
    }
    if(reward.requiredPoints){
      console.log("logged decrement")
      await this.userRepository.updatePoints(userId,-reward.requiredPoints)
    }
    await this.userRepository.addClaimedReward(userId, rewardId);
  }

  async checkIn(userId: string): Promise<IUser> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error("User not found");

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastUpdate = user.lastStreakUpdate ? new Date(user.lastStreakUpdate) : null;
    if (lastUpdate) lastUpdate.setHours(0, 0, 0, 0);

    let streak = user.streak;
    if (!lastUpdate || lastUpdate.getTime() < today.getTime() - 24 * 60 * 60 * 1000) {
      streak = 1;
    } else if (lastUpdate.getTime() === today.getTime() - 24 * 60 * 60 * 1000) {
      streak += 1;
    } else if (lastUpdate.getTime() === today.getTime()) {
      throw new Error("Already checked in today");
    }

    const updatedUser = await this.userRepository.updateStreak(userId, streak, today);
    if (!updatedUser) throw new Error("Failed to update streak");

    return updatedUser;
  }

  async getUserDetails(userId: string): Promise<IUser> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error("User not found");
    return user;
  }
}