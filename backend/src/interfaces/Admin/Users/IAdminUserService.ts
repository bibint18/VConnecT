export interface IAdminUserService {
  getAllUsers(
    page: number,
    limit: number,
    searchTerm: string,
    sortOption: string
  ): Promise<any>;
  getTotalUsers(search: string): Promise<number>;
  blockUser(id: string): Promise<any>;
  unblockUser(id: string): Promise<any>;
  deleteUser(id: string): Promise<any>;
}
