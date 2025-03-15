import { IUserRepository } from "../interfaces/IUserRepository";
import { IUser,User } from "../models/User";
import { OtpVerification } from "../models/OtpModel";

export class UserRepository implements IUserRepository{
  async createUser(data: Partial<IUser>): Promise<IUser |null> {
    console.log("reached create user reposiory")
    return await new User(data).save()
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({email})
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
    console.log("reached updateUser repository",email,updateData)
    return await User.findOneAndUpdate({email},updateData,{new:true})
  }
}