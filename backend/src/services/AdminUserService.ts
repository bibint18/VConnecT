import { IAdminUserRepository } from "../interfaces/IAdminUserRepository.js";

export class AdminUserService{
  public AdminUserRepository:IAdminUserRepository
  constructor(AdminUserRepository:IAdminUserRepository){
    this.AdminUserRepository=AdminUserRepository
  }

  async getAllUsers (page:number,limit:number,searchTerm:string,sortOption:string){
    return await this.AdminUserRepository.getAllUsers(page,limit,searchTerm,sortOption)
  }
  async getTotalUsers(search:string){
    return await this.AdminUserRepository.getTotalUsers(search)
  }

  async blockUser(id:string){
    return await this.AdminUserRepository.blockUser(id)
  }

  async unblockUser(id:string){
    return await this.AdminUserRepository.unblockUser(id)
  }

  async deleteUser(id:string){
    return await this.AdminUserRepository.deleteUser(id)
  }
}