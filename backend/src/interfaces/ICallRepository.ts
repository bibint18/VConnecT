import { Types } from "mongoose";
import mongoose from "mongoose";
export interface ICallRepository{
  joinCall(roomId:string,userId:string):Promise<void>;
  leaveCall(roomId:string,userId:string):Promise<void>
  getRoomParticipants(roomId: string): Promise<{ participants: mongoose.Types.ObjectId[] } | null>;
}