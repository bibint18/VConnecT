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
}