import mongoose from "mongoose";
import { ICall,ICallInput,Call } from "../../../models/CallModel";
import { AppError } from "../../../utils/AppError";
import { IDirectCallRepository } from "../../../interfaces/user/Call/IDirectCallRepository";

export class DirectCallRepository implements IDirectCallRepository {
  async createCall(input: ICallInput): Promise<ICall> {
    try {
      const call = new Call({
        callerId: new mongoose.Types.ObjectId(input.callerId),
        receiverId: new mongoose.Types.ObjectId(input.receiverId),
        callId: input.callId,
        startTime: input.startTime,
        status: input.status,
      });
      await call.save();
      return call;
    } catch (error) {
      console.error("Error creating call:", error);
      throw new AppError("Failed to create call", 500);
    }
  }

  async getCallById(callId: string): Promise<ICall | null> {
    try {
      return await Call.findOne({ callId }).exec();
    } catch (error) {
      console.error("Error fetching call:", error);
      throw new AppError("Failed to fetch call", 500);
    }
  }

  async updateCallStatus(callId: string, status: "INITIATED" | "ACCEPTED" | "REJECTED" | "MISSED" | "COMPLETED"): Promise<void> {
    try {
      const call = await Call.findOne({ callId }).exec();
      if (!call) {
        throw new AppError("Call not found", 404);
      }
      call.status = status;
      if (status === "COMPLETED") {
        call.endTime = new Date();
      }
      await call.save();
    } catch (error) {
      console.error("Error updating call status:", error);
      throw new AppError("Failed to update call status", 500);
    }
  }

  async endCall(callId: string, userId: string): Promise<void> {
    try {
      const call = await Call.findOne({ callId }).exec();
      if (!call) {
        throw new AppError("Call not found", 404);
      }
      if (call.status !== "ACCEPTED") {
        throw new AppError("Call is not active", 400);
      }
      call.status = "COMPLETED";
      call.endTime = new Date();
      await call.save();
    } catch (error) {
      console.error("Error ending call:", error);
      throw error instanceof AppError ? error : new AppError("Failed to end call", 500);
    }
  }
}