import { ICallRepository } from "../interfaces/ICallRepository";
import { IParticipant, Room } from "../models/RoomModel";
import { AppError } from "../utils/AppError";
import mongoose from "mongoose";
export class CallRepository implements ICallRepository{
  async joinCall(roomId: string, userId: string): Promise<void> {
    try {
      console.log("call Repository ",roomId,userId)
      const room = await Room.findById(roomId).exec()
      if(!room){
        throw new AppError("Room not found",404)
      }
      if(!userId){
        throw new AppError("No user id reached backend",404)
      }
      if(room.participants.length >= room.limit){
        throw new AppError("Room is full",400)
      }
      // if(!room.participants.some((id) => id.toString() === userId)){
      //   room.participants.push(userId as any)
      //   await room.save()
      // }
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
      const room = await Room.findById(roomId).exec()
      if(!room) throw new AppError("Room not found",404)
        // room.participants=room.participants.filter((id) => id.toString() !== userId)
        // await room.save()
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
    const room = await Room.findById(roomId).exec();
    return room ? { participants: room.participants } : null;
  }

}