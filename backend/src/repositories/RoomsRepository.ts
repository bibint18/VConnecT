import { Room ,IRoom} from "../models/RoomModel.js";
import { IRoomRepository } from "../interfaces/IRoomRepository.js";
import mongoose from "mongoose";
import { AppError } from "../utils/AppError.js";
import { User ,IUser} from "../models/User.js";
import { BaseRepository } from "./Base/BaseRepository.js";

export class RoomRepository extends BaseRepository<IRoom> implements IRoomRepository{
  constructor(){
    super(Room)
  }
  async createRoom(roomData:Partial<IRoom>):Promise<IRoom | null>{
    const user = await User.findById(roomData.createdBy)
    if (!user) {
      throw new AppError("User not found", 404);
    }
    
    if(user?.availableRoomLimit ==0){
      throw new Error("You have reached your room creation limit!!!")
    }
    if(!roomData.title){
      throw new Error("Title is required")
    }
    if(roomData.title.trim()===''){
      throw new Error("Should add title")
    }
    const existingTitle = await Room.findOne({title:roomData.title})
    if(existingTitle){
      throw new Error("Title already exist")
    }
    if(!roomData.limit){
      throw new Error("Limit is required")
    }
    if(roomData.limit>10 || roomData.limit<1){
      throw new Error("Limit should between 1-10")
    }
    if(!roomData.description){
      throw new Error("Description is required")
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
    type?: "PUBLIC" | "PRIVATE" | "MY"): Promise<{ rooms: IRoom[], user: IUser | null ; total:number }> {
    const user = await User.findById(userId)
    const query:any = {};
    if(search){
      query.$or = [{title:{$regex:search,$options:'i'}},{description:{$regex:search,$options:'i'}}]
    }
    if(type==='MY'){
      console.log("My repo")
      query.createdBy=new mongoose.Types.ObjectId(userId)
    }else if(type==='PRIVATE' || type==='PUBLIC'){
      query.type=type
    }
    query.isDeleted = false;
    query.isBlocked = false;
    const skip = (page -1) * limit;

    const rooms = await this.findMany(query)
    .populate("createdBy", "name email").populate("participants.userId", "name email").sort({createdAt:-1}).skip(skip).limit(limit).exec()
    const total=await this.count(query)
    return {rooms,user,total}
  }

  async joinRoom(RoomId: string, userId: string, secretCode: string): Promise<IRoom | null> {
    try {
      const room =await this.findById(RoomId)
      .populate("createdBy", "name email").populate("participants.userId", "name email");
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
            const isParticipant = room.participants.some((p) => p.userId.toString() === userId);
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

  async deleteRoom(roomId: string): Promise<void> {
    try {
      const room =await this.findById(roomId)
      if(!room){
        throw new Error("No Room")
      }
      await Room.findByIdAndUpdate(roomId,{isDeleted:true})
    } catch (error) {
      
    }
  }
}