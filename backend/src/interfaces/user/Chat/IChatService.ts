import { IMessage } from "../../../models/MessageModel";
import { Namespace, Socket } from "socket.io";

export interface IChatService{
  sendMessage(senderId:string,recieverId:string,content:string):Promise<void>;
  getChatHistory(senderId:string,recieverId:string): Promise<IMessage[]>;
  getLastMessage(senderId:string,recieverId:string):Promise<IMessage | null>
  handleSocketEvents(socket:Socket):void


  //calls
  startFriendCall(callerId: string, receiverId: string): Promise<void>;
  acceptFriendCall(callId: string, userId: string,socket:Socket): Promise<void>;
  rejectFriendCall(callId: string, userId: string): Promise<void>;
  endFriendCall(callId: string, userId: string): Promise<void>;
}