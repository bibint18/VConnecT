import { IAdminUserService } from "../interfaces/Admin/Users/IAdminUserService.js";
import { IAdminUserRepository } from "../interfaces/IAdminUserRepository.js";

export class AdminUserService implements IAdminUserService{
  public AdminUserRepository:IAdminUserRepository
  constructor(AdminUserRepository:IAdminUserRepository){
    this.AdminUserRepository=AdminUserRepository
  }

  async getAllUsers(page: number, limit: number, searchTerm: string, sortOption: string): Promise<any> {
     return await this.AdminUserRepository.getAllUsers(page,limit,searchTerm,sortOption)
  }
  async getTotalUsers(search: string): Promise<number> {
    return await this.AdminUserRepository.getTotalUsers(search)
  }

  async blockUser(id: string): Promise<any> {
    return await this.AdminUserRepository.blockUser(id)
  }

  async unblockUser(id: string): Promise<any> {
    return await this.AdminUserRepository.unblockUser(id)
  }

  async deleteUser(id: string): Promise<any> {
    return await this.AdminUserRepository.deleteUser(id)
  }
}