import { IMessage,IMessageInput } from "../../../models/MessageModel";

export interface IChatRepository{
  saveMessage(message:IMessageInput):Promise<void>;
  getMessages(senderId:string,recieverId:string):Promise<IMessage[]>;
  getLastMessage(senderId:string,recieverId:string):Promise<IMessage | null>
}