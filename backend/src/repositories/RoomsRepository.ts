import { Room ,IRoom} from "../models/RoomModel";
import { IRoomRepository } from "../interfaces/IRoomRepository";
import mongoose from "mongoose";

export class RoomRepository implements IRoomRepository{
  async createRoom(roomData:IRoom):Promise<IRoom | null>{
    if(roomData.title.trim()===''){
      throw new Error("Should add title")
    }
    const existingTitle = await Room.findOne({title:roomData.title})
    if(existingTitle){
      throw new Error("Title already exist")
    }
    if(roomData.limit>10 || roomData.limit<1){
      throw new Error("Limit should between 1-10")
    }
    if(roomData.description.trim()===''){
      throw new Error("Should add description")
    }
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
      console.log("repository rooom",room,userId)
      if(room?.isBlocked){
        throw new Error("Room is Blocked")
      }
      if(!room){
        throw new Error("Room not found...")
      }
      if(room.type==='PRIVATE' && room.secretCode !== secretCode){
        throw new Error("Invalid secret code...")
      }
      if(room.participants.some((id) => id.toString() ===userId)){
        return room
      }
      // if(room.participants.length >= room.limit){
      //   throw new Error('Room is full...')
      // }
      // room.participants.push(userId as any)
      // return await room.save()
      const participantIndex = room.participants.findIndex((p) => p.userId.toString() ===userId)
      const now = new Date()
      if(participantIndex  ===-1){
        room.participants.push({
          userId:new mongoose.Types.ObjectId(userId),
          firstJoin:now,
          lastJoin:now,
          lastLeave:null,
          totalDuration:0,
        })
      }else{
        room.participants[participantIndex].lastJoin=now
      }
      return await room.save()
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}