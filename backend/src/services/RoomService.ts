
import { IRoomRepository } from "../interfaces/IRoomRepository.js";
import { IRoom } from "../models/RoomModel.js";
import { v4 as uuidv4 } from 'uuid';
import { IUser } from "../models/User.js";
export class RoomService {
  private roomRepository:IRoomRepository
  constructor(RoomRepo:IRoomRepository){
    this.roomRepository=RoomRepo
  }
  async createRoom(roomData:IRoom):Promise<IRoom | null>{
    if(roomData.type==='PRIVATE'){
      roomData.secretCode=uuidv4().slice(0,8)
    }
    const updatedRoom = await this.roomRepository.createRoom(roomData)
    return updatedRoom
  }

  async getAllRooms(userId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
    type?: "PUBLIC" | "PRIVATE"):Promise<{ rooms: IRoom[], user: IUser | null, total: number }>{
    const result = await this.roomRepository.getAllRooms(userId, page, limit, search, type)
    return result
  }

  async joinRoom(RoomId:string,userId:string,secretCode:string):Promise<IRoom | null>{
    console.log("serice layer room",RoomId,userId,secretCode)
    const room = await this.roomRepository.joinRoom(RoomId,userId,secretCode)
    console.log("room",room)
    return room
  }

  async deleteRoom(roomId:string):Promise<void>{
    return await this.roomRepository.deleteRoom(roomId)
  }
}