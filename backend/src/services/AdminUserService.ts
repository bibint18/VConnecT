import { IAdminUserService } from "../interfaces/Admin/Users/IAdminUserService.js";
import { IAdminUserRepository } from "../interfaces/IAdminUserRepository.js";
import { UserMapper } from "../mappers/AdminUser/AdminUserMapper.js";
import { AppError } from "../utils/AppError.js";

export class AdminUserService implements IAdminUserService{
  public AdminUserRepository:IAdminUserRepository
  constructor(AdminUserRepository:IAdminUserRepository){
    this.AdminUserRepository=AdminUserRepository
  }

  async getAllUsers(page: number, limit: number, searchTerm: string, sortOption: string): Promise<any> {
     const users=await this.AdminUserRepository.getAllUsers(page,limit,searchTerm,sortOption)
     const totalUsers=await this.AdminUserRepository.getTotalUsers(searchTerm)
     return UserMapper.toUsersResponseDTO(users,totalUsers)
  }
  async getTotalUsers(search: string): Promise<number> {
    return await this.AdminUserRepository.getTotalUsers(search)
  }

  async blockUser(id: string): Promise<any> {
    const user= await this.AdminUserRepository.blockUser(id)
    if(!user){
      throw new AppError("User not found",403)
    }
    return UserMapper.toBlockUserResponseDTO(user)
  }

  async unblockUser(id: string): Promise<any> {
    const user= await this.AdminUserRepository.unblockUser(id)
    if(!user){
      throw new AppError("User not found",403)
    }
    return UserMapper.toUnblockUserResponseDTO(user)
  }

  async deleteUser(id: string): Promise<any> {
    const user= await this.AdminUserRepository.deleteUser(id)
    if(!user){
      throw new AppError("User not found",403)
    }
    return UserMapper.toDeleteUserResponseDTO(user)
  }
}