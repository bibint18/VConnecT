import { Request,Response,NextFunction } from "express";
import { IRoom, Room } from "../models/RoomModel";
import { RoomService } from "../services/RoomService";
import { RoomRepository } from "../repositories/RoomsRepository";

export class RoomController {
  private roomService:RoomService
  constructor(roomService:RoomService){
    this.roomService=roomService
  }

  async createRoom(req:Request,res:Response,next:NextFunction) {
    try {
      const roomData :IRoom ={
        title:(req as any).body.title,
        limit: req.body.limit,
        premium: req.body.premium === 'Yes', // Convert string to boolean
        type: req.body.type,
        description: req.body.description,
      }
      const newRoom =await this.roomService.createRoom(roomData)
      res.status(200).json({room:newRoom})
    } catch (error) {
      next(error)
    }
  }
}

export default new RoomController(new RoomService(new RoomRepository()))