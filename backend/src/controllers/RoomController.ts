import { Request, Response, NextFunction } from "express";
import { IRoom } from "../models/RoomModel.js";
import { RoomService } from "../services/RoomService.js";
import { RoomRepository } from "../repositories/RoomsRepository.js";
import { HTTP_STATUS_CODE } from "../utils/statusCode.js";
import { IRoomController } from "../interfaces/user/Room/IRoomController.js";
import { RoomMapper } from "../mappers/Room/RoomMapper.js";
import { AppError } from "../utils/AppError.js";

export class RoomController implements IRoomController {
  private roomService: RoomService;
  constructor(roomService: RoomService) {
    this.roomService = roomService;
  }

  async createRoom(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const now = new Date();
      console.log(userId);
      const roomData: IRoom = {
        title: (req as any).body.title,
        limit: req.body.limit,
        premium: req.body.premium === "Yes",
        type: req.body.type,
        description: req.body.description,
        createdBy: userId,
        participants: [
          {
            userId: userId,
            firstJoin: now,
            lastJoin: now,
            lastLeave: null,
            totalDuration: 0,
          },
        ],
        isDeleted: false,
        isBlocked: false,
      };
      const newRoom = await this.roomService.createRoom(roomData);
      if(!newRoom){
        throw new AppError("Cannot create room",HTTP_STATUS_CODE.BAD_REQUEST)
      }
      const response = RoomMapper.toRoomResponse(newRoom)
      if (newRoom.type === "PRIVATE") {
      response.room.secretCode = newRoom.secretCode;
    }
      res.status(HTTP_STATUS_CODE.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getAllRooms(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id as string;
      const { search, type, page = "1", limit = "10" } = req.query;
      const result = await this.roomService.getAllRooms(
        userId,
        parseInt(page as string, 10),
        parseInt(limit as string, 10),
        search as string,
        type as "PUBLIC" | "PRIVATE" | "MY"
      );
      const response = RoomMapper.toRoomsResponse(result.rooms, result.user, result.total)
      res.status(HTTP_STATUS_CODE.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async joinRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const { roomId, secretCode } = req.body;
      if (!roomId) {
        throw new Error("Room id is required");
      }
      const updatedRoom = await this.roomService.joinRoom(
        roomId,
        userId,
        secretCode
      );
      if(!updatedRoom){
        throw new AppError("Cannot join room",HTTP_STATUS_CODE.BAD_REQUEST)
      }
      const response = RoomMapper.toRoomResponse(updatedRoom);
      response.message = "Joined room successfully!";
      res
        .status(HTTP_STATUS_CODE.OK)
        .json({ room: updatedRoom, message: "Joined room successfully!" });
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
      const { roomId } = req.params;
      await this.roomService.deleteRoom(roomId);
      const response = RoomMapper.toDeleteRoomResponse()
      res.status(HTTP_STATUS_CODE.OK).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default new RoomController(new RoomService(new RoomRepository()));
