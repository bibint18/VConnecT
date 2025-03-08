export interface IAdminUserRepository{
  getAllUsers(page:number,limit:number):Promise<any>;
  getUserById(id:string): Promise<any>
  blockUser(id:string) : Promise<any>
  unblockUser(id:string) : Promise<any>
  deleteUser(id:string): Promise<any>
}