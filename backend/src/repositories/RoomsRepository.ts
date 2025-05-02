import { Room ,IRoom} from "../models/RoomModel";
import { IRoomRepository } from "../interfaces/IRoomRepository";
import mongoose from "mongoose";
import { AppError } from "../utils/AppError";
import { User ,IUser} from "../models/User";

export class RoomRepository implements IRoomRepository{
  async createRoom(roomData:IRoom):Promise<IRoom | null>{
    const user = await User.findById(roomData.createdBy)
    if (!user) {
      throw new AppError("User not found", 404);
    }
    
    if(user?.availableRoomLimit ==0){
      throw new Error("You have reached your room creation limit!!!")
    }
    console.log('Users room create limit',user?.availableRoomLimit)
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
    const updatedUser = await User.findByIdAndUpdate(roomData.createdBy,{$inc:{availableRoomLimit:-1}},{new:true,runValidators:true});
    if(!updatedUser){
      throw new AppError("Failed to update room limit : User not found",500)
    }
    if (updatedUser.availableRoomLimit < 0) {
      throw new AppError("Room limit cannot be negative", 500);
    }
    return savedRoom
  }

  async getAllRooms(userId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
    type?: "PUBLIC" | "PRIVATE"): Promise<{ rooms: IRoom[], user: IUser | null ; total:number }> {
    const user = await User.findById(userId)
    const query:any = {};
    if(search){
      query.$or = [{title:{$regex:search,$options:'i'}},{description:{$regex:search,$options:'i'}}]
    }
    if(type){
      query.type =type;
    }
    query.isDeleted = false;
    query.isBlocked = false;
    const skip = (page -1) * limit;

    const rooms = await Room.find(query).skip(skip).limit(limit).exec()
    console.log("rooms from service ",rooms)
    const total = await Room.countDocuments(query)
    return {rooms,user,total}
  }

  async joinRoom(RoomId: string, userId: string, secretCode: string): Promise<IRoom | null> {
    try {
      const room = await Room.findById(RoomId)
      console.log("repository rooommmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm",room,userId)
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
      const activeParticipants = room.participants.filter((p) => !p.lastLeave || p.lastJoin > p.lastLeave);
            console.log("active participantsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",activeParticipants)
            const isParticipant = room.participants.some((p) => p.userId.toString() === userId);
            console.log("is participantsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",isParticipant)
            console.log("active participants length",activeParticipants.length)
            if (!isParticipant && activeParticipants.length >= room.limit) {
              throw new AppError("Room is full", 400);
            }
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