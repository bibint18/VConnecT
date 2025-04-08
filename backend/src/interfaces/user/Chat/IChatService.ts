import { IMessage } from "../../../models/MessageModel";
import { Socket } from "socket.io";

export interface IChatService{
  sendMessage(senderId:string,recieverId:string,content:string):Promise<void>;
  getChatHistory(senderId:string,recieverId:string): Promise<IMessage[]>;
  getLastMessage(senderId:string,recieverId:string):Promise<IMessage | null>
  handleSocketEvents(socket:Socket):void
}