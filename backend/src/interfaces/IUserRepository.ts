import { IUser } from "../models/User";

export interface IUserRepository{
  createUser(user:IUser): Promise<IUser>;
  findByEmail(email:string): Promise<IUser | null>;
  updateOtp(email:String,otp:String,otpExpiry:Date): Promise<void>;
  verifyOtp(email: string, otp: string): Promise<IUser | null>;
}