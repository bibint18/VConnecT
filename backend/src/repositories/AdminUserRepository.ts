import { IUser,User } from "../models/User";
import { IAdminUserRepository } from "../interfaces/IAdminUserRepository";
export class AdminUserRepository implements IAdminUserRepository{
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
    return await User.find(query)
    .sort(sortQuery)
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