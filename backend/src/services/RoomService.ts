import { promises } from "dns";
import { IRoomRepository } from "../interfaces/IRoomRepository";
import { IRoom } from "../models/RoomModel";
import { v4 as uuidv4 } from 'uuid';
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

  async getAllRooms():Promise<IRoom[] | null>{
    const rooms = await this.roomRepository.getAllRooms()
    return rooms
  }

  async joinRoom(RoomId:string,userId:string,secretCode:string):Promise<IRoom | null>{
    console.log("serice layer room",RoomId,userId,secretCode)
    const room = await this.roomRepository.joinRoom(RoomId,userId,secretCode)
    console.log("room",room)
    return room
  }
}