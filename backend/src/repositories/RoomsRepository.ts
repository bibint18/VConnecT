import { Room ,IRoom} from "../models/RoomModel";
import { IRoomRepository } from "../interfaces/IRoomRepository";

export class RoomRepository implements IRoomRepository{
  async createRoom(roomData:IRoom):Promise<IRoom | null>{
    const room = new Room(roomData)
    const savedRoom=await room.save()
    return savedRoom
  }
}