import { IRoomRepository } from "../interfaces/IRoomRepository";
import { IRoom } from "../models/RoomModel";

export class RoomService {
  private roomRepository:IRoomRepository
  constructor(RoomRepo:IRoomRepository){
    this.roomRepository=RoomRepo
  }
  async createRoom(roomData:IRoom):Promise<IRoom | null>{
    const updatedRoom = await this.roomRepository.createRoom(roomData)
    return updatedRoom
  }
}