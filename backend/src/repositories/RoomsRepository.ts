import { Room ,IRoom} from "../models/RoomModel";
import { IRoomRepository } from "../interfaces/IRoomRepository";

export class RoomRepository implements IRoomRepository{
  async createRoom(roomData:IRoom):Promise<IRoom | null>{
    const room = new Room(roomData)
    const savedRoom=await room.save()
    return savedRoom
  }

  async getAllRooms(): Promise<IRoom[] | null> {
    const rooms = await Room.find().exec()
    console.log("rooms from service ",rooms)
    return rooms
  }

  async joinRoom(RoomId: string, userId: string, secretCode: string): Promise<IRoom | null> {
    try {
      const room = await Room.findById(RoomId)
      console.log("repository rooom",room)
      if(!room){
        throw new Error("Room not found...")
      }
      if(room.type==='PRIVATE' && room.secretCode !== secretCode){
        throw new Error("Invalid secret code...")
      }
      if(room.participants.some((id) => id.toString() ===userId)){
        return room
      }
      if(room.participants.length >= room.limit){
        throw new Error('Room is full...')
      }
      room.participants.push(userId as any)
      return await room.save()
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}