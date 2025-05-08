import { IMessage } from "../../../models/MessageModel";
import {  Socket } from "socket.io";

export interface IChatService{
  sendMessage(senderId:string,recieverId:string,content?:string,mediaUrl?:string,mediaType?: 'text' | 'image' | 'video'):Promise<void>;
  getChatHistory(senderId:string,recieverId:string): Promise<IMessage[]>;
  getLastMessage(senderId:string,recieverId:string):Promise<IMessage | null>
  handleSocketEvents(socket:Socket):void


  //calls
  startFriendCall(callerId: string, receiverId: string): Promise<void>;
  acceptFriendCall(callId: string, userId: string,socket:Socket): Promise<void>;
  rejectFriendCall(callId: string, userId: string): Promise<void>;
  endFriendCall(callId: string, userId: string): Promise<void>;
  getUnreadMessageCount(userId: string, friendId: string): Promise<number>;
  markMessagesAsRead(userId: string, friendId: string): Promise<void>;
}