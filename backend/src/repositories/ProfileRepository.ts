import { IProfileRepository } from "../interfaces/IProfileRepository";
import { IUser } from "../models/User";
import { User } from "../models/User";

export class ProfileRepository implements IProfileRepository{
  async findById(id: string): Promise<IUser | null> {
    try {
      return await User.findById(id).exec()
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
}