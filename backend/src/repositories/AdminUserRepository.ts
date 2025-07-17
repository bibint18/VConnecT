import {IUser, User } from "../models/User.js";
import { IAdminUserRepository } from "../interfaces/IAdminUserRepository.js";
import { BaseRepository } from "./Base/BaseRepository.js";
export class AdminUserRepository extends BaseRepository<IUser> implements IAdminUserRepository{
  constructor(){
    super(User)
  }
  async getAllUsers(page:number,limit:number,searchTerm:string,sortOption:string){
    const query: any = {isAdmin:false,isDeleted:false}
    if(searchTerm){
      query.name={$regex:searchTerm,$options: "i"};
    }
    let sortQuery: any = {}
    if(sortOption==="A-Z"){
      sortQuery={name:1}
    }else if(sortOption==='Z-A'){
      sortQuery={name:-1}
    }else if(sortOption==='recent'){
      sortQuery={createdAt:-1}
    }
    // return await User.find(query)
    return await this.findMany(query)
    .populate('plan.planId','name')
    .sort(sortQuery)
    .skip((page-1) * limit)
    .limit(limit).lean().exec()
  }
  async getTotalUsers(search: string): Promise<number> {
    let query:any = {isDeleted:false,isAdmin:false}
    if(search){
      query.name={$regex:search,$options:'i'}
    }
    // return await User.countDocuments(query)
    return await this.count(query)
  }

  async getUserById (id:string){
    // return await User.findById(id).lean()
    return await this.findById(id).lean()
  }

  async blockUser(id:string){
    return await User.findByIdAndUpdate(id,{isBlocked:true},{new:true}).lean()
  }

  async unblockUser(id:string){
    return await User.findByIdAndUpdate(id,{isBlocked:false},{new:true}).lean()
  }

  async deleteUser(id:string){
    return await User.findByIdAndUpdate(id,{isDeleted:true},{new:true}).lean()
  }
}