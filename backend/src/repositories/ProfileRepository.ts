import { IProfileRepository } from "../interfaces/IProfileRepository.js";
import { IUser } from "../models/User.js";
import { User } from "../models/User.js";
import { BaseRepository } from "./Base/BaseRepository.js";

export class ProfileRepository extends BaseRepository<IUser> implements IProfileRepository{
  constructor(){
    super(User)
  }
  async findByIdd(id: string): Promise<IUser | null> {
    try {
      return await super.findById(id).exec()
    } catch (error) {
      console.error('error finding user by id',error)
      throw error
    }
  }
  async updateProfile(id: string, data: Partial<IUser>): Promise<IUser | null> {
    try {
      console.log("reached profile update repository",id,data)   
      const updatedUser = await User.findByIdAndUpdate(id,data,{new:true}).exec()
      console.log("updated user from repo ",updatedUser)
      return updatedUser
    } catch (error) {
      console.error("error updating user",error)
      throw error
    }
  }

  async updateStreak(id: string): Promise<IUser | null> {
    try {
      const user = await super.findById(id).exec()
      // const user = await User.findById(id).exec();
      if (!user) return null;
      const now = new Date();
      const lastUpdate = user.lastStreakUpdate;
      const timeDiff = lastUpdate ? now.getTime() - lastUpdate.getTime() : Infinity;
      const twentyFourHours = 24 * 60 * 60 * 1000;
      if (lastUpdate && timeDiff < twentyFourHours) {
        return user; 
      }
      if (!lastUpdate || timeDiff > twentyFourHours) {
        user.streak = 1;
      } else {
        user.streak += 1;
      }
      user.lastStreakUpdate = now;

      const updatedUser = await user.save();
      return updatedUser;
    } catch (error) {
      console.error("error updating streak", error);
      throw error;
    }
  }
}