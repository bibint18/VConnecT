import { IUser } from "../models/User";

export interface IUserRepository{
  createUser(data: Partial<IUser>): Promise<IUser |null>;
  findByEmail(email:string): Promise<IUser | null>;
  findByUsername(username:string):Promise<IUser | null>
  updateOtp(email:String,otp:String,otpExpiry:Date): Promise<void>;
  verifyOtp(email: string, otp: string): Promise<IUser | null>;
  updateUser(email: string, updateData: Partial<IUser>): Promise<IUser | null>;
}