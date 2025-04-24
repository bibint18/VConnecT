import { ICall,ICallInput } from "../../../models/CallModel";

export interface IDirectCallRepository {
  createCall(input: ICallInput): Promise<ICall>;
  getCallById(callId: string): Promise<ICall | null>;
  updateCallStatus(callId: string, status: "INITIATED" | "ACCEPTED" | "REJECTED" | "MISSED" | "COMPLETED"): Promise<void>;
  endCall(callId: string, userId: string): Promise<void>;
}