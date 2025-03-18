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
      const userId = (req as any).user?.id
      const roomData :IRoom ={
        title:(req as any).body.title,
        limit: req.body.limit,
        premium: req.body.premium === 'Yes', 
        type: req.body.type,
        description: req.body.description,
        createdBy:userId,
        participants:[userId]
      }
      const newRoom =await this.roomService.createRoom(roomData)
      res.status(200).json({room:newRoom})
    } catch (error) {
      next(error)
    }
  }

  async getAllRooms(req:Request,res:Response,next:NextFunction){
    try {
      const rooms = await this.roomService.getAllRooms()
      res.status(200).json({rooms})
    } catch (error) {
      next(error)
    }
  }

  async joinRoom(req:Request,res:Response,next:NextFunction){
    try {
      const userId=(req as any).user.id
      const {roomId,secretCode} = req.body
      if(!roomId){
        throw new Error("Room id is required")
      }
      const updatedRoom = await this.roomService.joinRoom(roomId,userId,secretCode)
      res.status(200).json({room:updatedRoom,message:"Joined room successfully!"})
    } catch (error) {
      next(error)
    }
  }
}

export default new RoomController(new RoomService(new RoomRepository()))