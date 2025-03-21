import { ICallRepository } from "../interfaces/ICallRepository";
import { Room } from "../models/RoomModel";
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
      if(!room.participants.some((id) => id.toString() === userId)){
        room.participants.push(userId as any)
        await room.save()
      }
    } catch (error) {
      console.log(error)
      throw error instanceof AppError ? error : new AppError ("failed to join call",500)
    }
  }

  async leaveCall(roomId: string, userId: string): Promise<void> {
    try {
      const room = await Room.findById(roomId).exec()
      if(!room) throw new AppError("Room not found",404)
        room.participants=room.participants.filter((id) => id.toString() !== userId)
        await room.save()
    } catch (error) {
      throw error instanceof AppError ? error : new AppError("Failed to leave call",500)
    }
  }

  async getRoomParticipants(roomId: string): Promise<{ participants: mongoose.Types.ObjectId[] } | null> {
    const room = await Room.findById(roomId).exec();
    return room ? { participants: room.participants } : null;
  }

}