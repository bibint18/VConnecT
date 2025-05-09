import { IMessage,IMessageInput } from "../../../models/MessageModel.js";

export interface IChatRepository{
  saveMessage(message:IMessageInput):Promise<void>;
  getMessages(senderId:string,recieverId:string):Promise<IMessage[]>;
  getLastMessage(senderId:string,recieverId:string):Promise<IMessage | null>
  getUnreadMessageCount(userId:string,friendId:string):Promise<number>
  markMessageAsRead(userId:string,friendId:string):Promise<void>
}