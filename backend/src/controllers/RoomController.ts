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
      const now = new Date()
      console.log(userId)
      const roomData :IRoom ={
        title:(req as any).body.title,
        limit: req.body.limit,
        premium: req.body.premium === 'Yes', 
        type: req.body.type,
        description: req.body.description,
        createdBy:userId,
        participants:[{
          userId:userId,
          firstJoin:now,
          lastJoin:now,
          lastLeave:null,
          totalDuration:0
        }],
        isDeleted:false,
        isBlocked:false
      }
      const newRoom =await this.roomService.createRoom(roomData)
      res.status(200).json({room:newRoom})
    } catch (error) {
      next(error)
    }
  }

  async getAllRooms(req:Request,res:Response,next:NextFunction){
    try {
      const userId = req.user?.id as string
      const {rooms,user} = await this.roomService.getAllRooms(userId)
      res.status(200).json({rooms,user})
    } catch (error) {
      next(error)
    }
  }

  async joinRoom(req:Request,res:Response,next:NextFunction){
    try {
      console.log("reached join room controller ")
      const userId=(req as any).user.id
      const {roomId,secretCode} = req.body
      console.log('backend join room controller',roomId,secretCode,userId)
      if(!roomId){
        throw new Error("Room id is required")
      }
      const updatedRoom = await this.roomService.joinRoom(roomId,userId,secretCode)
      console.log("updatedRoom controller",updatedRoom)
      res.status(200).json({room:updatedRoom,message:"Joined room successfully!"})
    } catch (error) {
      next(error)
    }
  }
}

export default new RoomController(new RoomService(new RoomRepository()))