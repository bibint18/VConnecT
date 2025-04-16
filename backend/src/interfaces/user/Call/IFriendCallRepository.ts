import { ICall, ICallInput } from "../../../models/CallModel"; 
export interface IFriendCallRepository{
  createCall(call:ICallInput):Promise<ICall>;
  findCallById(callId:string):Promise<ICall | null>;
  updateCall(callId:string,updates:Partial<ICall>):Promise<ICall | null>
}