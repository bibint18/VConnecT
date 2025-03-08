import { IUser,User } from "../models/User";
import { IAdminUserRepository } from "../interfaces/IAdminUserRepository";
export class AdminUserRepository implements IAdminUserRepository{
  async getAllUsers(page:number,limit:number){
    return await User.find({isAdmin:false,isDeleted:false})
    .skip((page-1) * limit)
    .limit(limit)
  }

  async getUserById (id:string){
    return await User.findById(id)
  }

  async blockUser(id:string){
    return await User.findByIdAndUpdate(id,{isBlocked:true},{new:true})
  }

  async unblockUser(id:string){
    return await User.findByIdAndUpdate(id,{isBlocked:false},{new:true})
  }

  async deleteUser(id:string){
    return await User.findByIdAndUpdate(id,{isDeleted:true},{new:true})
  }
}