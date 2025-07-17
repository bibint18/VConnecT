import { IUser } from "../models/User.js";

export interface IProfileRepository{
  findByIdd(id:string):Promise<IUser | null> 
  updateProfile(id:string,data:Partial<IUser>): Promise<IUser | null>
  updateStreak(id:string): Promise <IUser | null >
}