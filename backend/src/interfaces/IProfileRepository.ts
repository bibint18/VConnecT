import { IUser } from "../models/User";

export interface IProfileRepository{
  findById(id:string):Promise<IUser | null> 
}