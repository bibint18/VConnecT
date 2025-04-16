import { IUser } from "../../../models/User";

export interface IUserRewardRepository {
  findById(id: string): Promise<IUser | null>;
  updateUser(id: string, updates: Partial<IUser>): Promise<IUser | null>;
  updateRoomLimit(userId: string, increment: number): Promise<IUser | null>;
  addClaimedReward(userId: string, rewardId: string): Promise<IUser | null>;
  updatePoints(userId: string, points: number): Promise<IUser | null>;
  updateStreak(userId: string, streak: number, lastUpdate: Date): Promise<IUser | null>;
}