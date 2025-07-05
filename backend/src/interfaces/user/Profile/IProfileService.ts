import { IUser } from "../../../models/User";

export interface IProfileService{
  getUserProfile(userId:string): Promise<IUser>
  updateUserProfile(userId:string,data:Partial<IUser>):Promise<IUser>
  updateProfileImage(userId:string,imageurl:string):Promise<IUser | null>
  updateStreak(id:string) : Promise<IUser| null>
  changePassword(userId: string, currentPassword: string, newPassword: string): Promise<IUser>
}