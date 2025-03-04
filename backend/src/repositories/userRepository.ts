import { IUserRepository } from "../interfaces/IUserRepository";
import { IUser,User } from "../models/User";
import bcrypt from 'bcryptjs'

export class UserRepository implements IUserRepository{
  async createUser(data: Partial<IUser>): Promise<IUser |null> {
    // const password=data.password
    if(!data.password) return null
    data.password=await bcrypt.hash(data.password,10)
    return await new User(data).save()
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({email})
  }

  async updateOtp(email: String, otp: String, otpExpiry: Date): Promise<void> {
    await User.findOneAndUpdate({email},{otp,otpExpiry})
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
}