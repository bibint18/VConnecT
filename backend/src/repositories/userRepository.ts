import { IUserRepository } from "../interfaces/IUserRepository.js";
import { IUser,User } from "../models/User.js";
import { OtpVerification } from "../models/OtpModel.js";
import { Types } from "mongoose";
import { Room } from "../models/RoomModel.js";
import { BaseRepository } from "./Base/BaseRepository.js";

export class UserRepository extends BaseRepository<IUser> implements IUserRepository{
  constructor(){
    super(User)
  }
  async createUser(data: Partial<IUser>): Promise<IUser |null> {
    return await super.create(data)
  }

  async findById(id: string): Promise<IUser | null> {
    return await super.findById(id)
  }
  
  async findByEmail(email: string): Promise<IUser | null> {
    return await this.findOne({email})
  }

  async updateOtp(email: String, otp: String, otpExpiry: Date): Promise<void> {
    console.log("otpExpiry: ",otpExpiry)
    await OtpVerification.findOneAndUpdate({email},{otp,expiresAt:otpExpiry},{upsert:true,new:true})
  }

  async verifyOtp(email: string, otp: string): Promise<IUser | null> {
    const user = await User.findOne({email})
    if(!user || user.otp !==otp ||!user.otpExpiry || new Date() > user.otpExpiry) return null
    user.isVerified=true
    user.otp=undefined
    user.otpExpiry=undefined
    await user.save()
    return user
  }

  async updateUser(email:string,updateData:Partial<IUser>){
    return await User.findOneAndUpdate({email},updateData,{new:true})
  }

  async findByUsername(username:string):Promise<IUser | null> {
    try {
      const userName = await User.findOne({username}).exec()
      return userName
    } catch (error) {
      console.log('error finding user by username',error)
      throw Error
    }
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

  async updateUserPlans(userId: string, planData: { planId: Types.ObjectId; planName: string; status: "active" | "expired" | "cancelled"; startDate: Date; endDate?: Date; transactionId?: string; },roomBenefit?:number): Promise<IUser> {
      const user = await User.findById(userId)
      if(!user){
        throw new Error("User not found")
      }
      user.plan = user.plan.map((plan) => plan.status ==='active' ? {...plan,status:'expired',endDate:new Date()} : plan)
      user.plan.push(planData)
      if(roomBenefit){
        user.availableRoomLimit = (user.availableRoomLimit || 0) + roomBenefit
      }
      return await user.save()
  }

  async Homedata(): Promise<{ roomCount: number; userCount: number; }> {
    const roomCount = await Room.countDocuments();
    const userCount = await User.countDocuments();
    return {roomCount,userCount}
  }
}