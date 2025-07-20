import { ICallRepository } from "../interfaces/ICallRepository.js";
import { IParticipant, IRoom, Room } from "../models/RoomModel.js";
import { AppError } from "../utils/AppError.js";
import mongoose from "mongoose";
import { BaseRepository } from "./Base/BaseRepository.js";
export class CallRepository extends BaseRepository<IRoom> implements ICallRepository{
  constructor(){
    super(Room)
  }
  async joinCall(roomId: string, userId: string): Promise<void> {
    try {
      const room = await this.findById(roomId).exec()
      if(!room){
        throw new AppError("Room not found",404)
      }
      if(!userId){
        throw new AppError("No user id reached backend",404)
      }
      const activeParticipants = room.participants.filter((p) => !p.lastLeave || p.lastJoin > p.lastLeave);
      const isParticipant = room.participants.some((p) => p.userId.toString() === userId);
      if (!isParticipant && activeParticipants.length >= room.limit) {
        throw new AppError("Room is full", 400);
      }
      const participantIndex = room.participants.findIndex((p) => p.userId.toString() === userId)
      const now = new Date()
      if(participantIndex == -1){
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
      await room.save()
    } catch (error) {
      console.log(error)
      throw error instanceof AppError ? error : new AppError ("failed to join call",500)
    }
  }

  async leaveCall(roomId: string, userId: string): Promise<void> {
    try {
      const room = await this.findById(roomId).exec()
      if(!room) throw new AppError("Room not found",404)
        const participantIndex = room.participants.findIndex((p) => p.userId.toString() === userId);
        if (participantIndex === -1) {
          throw new AppError("User not found in room", 404);
        }
        const particpant = room.participants[participantIndex]
        const now = new Date()
        particpant.lastLeave=now
        const sessionDuration=now.getTime() - particpant.lastJoin.getTime()
        particpant.totalDuration +=sessionDuration
        await room.save()
    } catch (error) {
      throw error instanceof AppError ? error : new AppError("Failed to leave call",500)
    }
  }

  async getRoomParticipants(roomId: string): Promise<{ participants: IParticipant[] } | null> {
    const room = await this.findById(roomId).exec()
    return room ? { participants: room.participants } : null;
  }
  
}