import { AdminUserRepository } from "../repositories/AdminUserRepository.js";
import { AdminUserService } from "../services/AdminUserService.js";
import { Response, Request, NextFunction } from "express";
import { HTTP_STATUS_CODE } from "../utils/statusCode.js";
import { IAdminUserController } from "../interfaces/Admin/Users/IAdminUserController.js";
import { UserActionResponseDTO, UserResponseDTO } from "../dtos/AdminUser/AdminUserDTO.js";

export class AdminUsersController implements IAdminUserController {
  private adminUserService: AdminUserService;

  constructor(adminUserService: AdminUserService) {
    this.adminUserService = adminUserService;
  }

  async getAllUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        page = 1,
        limit = 6,
        searchTerm = "",
        sortOption = "A-Z",
      } = req.query;
      const response:UserResponseDTO = await this.adminUserService.getAllUsers(
        Number(page),
        Number(limit),
        String(searchTerm),
        String(sortOption)
      );
      res.status(HTTP_STATUS_CODE.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async blockUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const response:UserActionResponseDTO = await this.adminUserService.blockUser(id);
      res.status(HTTP_STATUS_CODE.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async unblockUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const response:UserActionResponseDTO = await this.adminUserService.unblockUser(id);
      res.status(HTTP_STATUS_CODE.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const response:UserActionResponseDTO = await this.adminUserService.deleteUser(id);
      res.status(HTTP_STATUS_CODE.OK).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default new AdminUsersController(
  new AdminUserService(new AdminUserRepository())
);
