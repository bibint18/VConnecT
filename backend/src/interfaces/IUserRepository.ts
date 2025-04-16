import { IUser } from "../models/User";

export interface IUserRepository{
  createUser(data: Partial<IUser>): Promise<IUser |null>;
  findByEmail(email:string): Promise<IUser | null>;
  findById(id:string):Promise<IUser | null>
  findByUsername(username:string):Promise<IUser | null>
  updateOtp(email:String,otp:String,otpExpiry:Date): Promise<void>;
  verifyOtp(email: string, otp: string): Promise<IUser | null>;
  updateUser(email: string, updateData: Partial<IUser>): Promise<IUser | null>;
  updateRoomLimit(userId: string, increment: number): Promise<IUser | null>;
  addClaimedReward(userId: string, rewardId: string): Promise<IUser | null>;
  updatePoints(userId: string, points: number): Promise<IUser | null>;
  updateStreak(userId: string, streak: number, lastUpdate: Date): Promise<IUser | null>;
}