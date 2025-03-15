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
}