import { Types } from "mongoose";
import mongoose from "mongoose";
import { IParticipant } from "../models/RoomModel";
export interface ICallRepository{
  joinCall(roomId:string,userId:string):Promise<void>;
  leaveCall(roomId:string,userId:string):Promise<void>
  getRoomParticipants(roomId: string): Promise<{ participants: IParticipant[] } | null>;
}