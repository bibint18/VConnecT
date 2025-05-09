import { IFriendCallRepository } from "../../../interfaces/user/Call/IFriendCallRepository.js";
import { Call,ICall, ICallInput } from "../../../models/CallModel.js";
import mongoose from "mongoose";

export class FriendCallRepository implements IFriendCallRepository{
  public async createCall(call: ICallInput): Promise<ICall> {
    const newCall = new Call({
      callerId:new mongoose.Types.ObjectId(call.callerId),
      receiverId:new mongoose.Types.ObjectId(call.receiverId),
      callId:call.callId,
      startTime:call.startTime,
      endTime:call.endTime,
      status:call.status,
    })
    return await newCall.save()
  }
  
  public async findCallById(callId: string): Promise<ICall | null> {
    return await Call.findOne({callId})
  }

  public async updateCall(callId: string, updates: Partial<ICall>): Promise<ICall | null> {
    return await Call.findOneAndUpdate({callId},updates,{new:true})
  }
}