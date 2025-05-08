
import { IProfileRepository } from "../interfaces/IProfileRepository";
import { IUser } from "../models/User";
import { AppError } from "../utils/AppError";
import bcrypt from 'bcryptjs'

export class ProfileService {
  private profileRepository:IProfileRepository
  constructor(profileRepo:IProfileRepository){
    this.profileRepository=profileRepo
  }

  async getUserProfile(userId:string): Promise<IUser>{
    const user = await this.profileRepository.findById(userId)
    if(!user) throw new AppError("user not found",403)
      return user
  }

  async updateUserProfile(userId:string,data:Partial<IUser>):Promise<IUser>{
    const updatedUser= await this.profileRepository.updateProfile(userId,data)
    if(!updatedUser) throw new AppError("Failed to update User",500)
      return updatedUser
  }

  async updateProfileImage(userId:string,imageurl:string):Promise<IUser | null>{
      console.log("reached profile image service",userId,imageurl)
      const updatedUser = await this.profileRepository.updateProfile(userId,{profileImage:imageurl})
      if(!updatedUser) throw new AppError("failed to update profile image",500)
        return updatedUser
  }

  async updateStreak(id:string) : Promise<IUser| null> {
    const updatedUser = await this.profileRepository.updateStreak(id)
    if (!updatedUser) throw new AppError("Failed to update streak", 500);
    return updatedUser;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<IUser> {
    const user = await this.profileRepository.findById(userId);
    if (!user) throw new AppError("User not found", 404);
    if (!user.password) {
      throw new AppError("No password set for this account. Use password reset.", 400);
    }
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new Error("Current password is incorrect");
    }
    if (newPassword.length < 8) {
      throw new AppError("New password must be at least 8 characters long", 400);
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await this.profileRepository.updateProfile(userId, { password: hashedPassword });
    if (!updatedUser) throw new AppError("Failed to update password", 500);

    return updatedUser;
  }
}