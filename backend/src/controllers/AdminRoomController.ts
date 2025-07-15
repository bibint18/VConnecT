import { Request, Response, NextFunction } from "express";
import { AdminRoomService } from "../services/AdminRoomService.js";
import { AdminRoomRepository } from "../repositories/AdminRoomRepository.js";
import { HTTP_STATUS_CODE } from "../utils/statusCode.js";
import { IAdminRoomController } from "../interfaces/Admin/Room/IAdminRoomController.js";

const roomService = new AdminRoomService(new AdminRoomRepository());
export class AdminRoomController implements IAdminRoomController {
  private adminRoomService: AdminRoomService;
  constructor(adminRoomService: AdminRoomService) {
    this.adminRoomService = adminRoomService;
  }
  async getAllRooms(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        page = 1,
        limit = 6,
        searchTerm = "",
        sortOption = "public",
      } = req.query;
      const response = await this.adminRoomService.getAllRooms(
        Number(page),
        Number(limit),
        String(searchTerm),
        String(sortOption)
      );
      // const totalRooms = await this.adminRoomService.getTotalRooms(String(searchTerm));
      res.status(HTTP_STATUS_CODE.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async blockRoom(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const room = await this.adminRoomService.blockRoom(id);
      res.status(HTTP_STATUS_CODE.OK).json(room);
    } catch (error) {
      next(error);
    }
  }

  async unblockRoom(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const room = await this.adminRoomService.unblockRoom(id);
      res.status(HTTP_STATUS_CODE.OK).json(room);
    } catch (error) {
      next(error);
    }
  }

  async deleteRoom(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const room = await roomService.deleteRoom(id);
      res.status(HTTP_STATUS_CODE.OK).json(room);
    } catch (error) {
      next(error);
    }
  }

  async getRoomDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const room = await this.adminRoomService.getRoomDetails(id);
      res.status(HTTP_STATUS_CODE.OK).json({ room });
    } catch (error) {
      next(error);
    }
  }
}

export default new AdminRoomController(
  new AdminRoomService(new AdminRoomRepository())
);
