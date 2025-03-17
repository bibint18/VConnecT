import exp from "constants";
import { IProfileRepository } from "../interfaces/IProfileRepository";
import { IUser } from "../models/User";
import { AppError } from "../utils/AppError";

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
}